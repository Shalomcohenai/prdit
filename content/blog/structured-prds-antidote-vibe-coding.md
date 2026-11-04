---
title: "Why Structured PRDs Are the Antidote to Vibe Coding"
slug: "structured-prds-antidote-vibe-coding"
excerpt: "A structured PRD records the actors, states, invariants, and errors an agent must not invent, so each coding session extends one product instead of several."
summary: "A structured PRD writes down the product decisions an agent is not allowed to invent, which is what stops vibe coding from forking the design."
date: "2026-05-20"
updated: "2026-11-04"
category: "engineering"
targetProductCTA: "specifys"
related:
  - how-to-write-prd-for-llm
  - vibe-coding-trap-ai-technical-debt
  - what-is-model-context-protocol-mcp
relatedProducts:
  - specifys
  - greenprd
  - riftcode
  - adpulse
tldr: >
  A structured PRD is the list of product decisions an implementation has to
  keep: who the actor is, which states exist, which invariant every request
  satisfies, and which errors are recoverable. Vibe coding skips that list,
  so each agent session picks a plausible design and the repository quietly
  holds several of them. Write the decisions down, keep the file in the repo,
  and point the next session at that file.
faq:
  - question: "What is a structured PRD?"
    answer: >
      A structured PRD names the actors, the entities and their fields, the
      states a record can be in, the invariant every code path has to
      preserve, the interface shapes, and the error codes. It is specific
      enough that two implementers would not invent two different products
      from it.
  - question: "How is a structured PRD different from a longer prompt?"
    answer: >
      Length is not structure. A long chat can still leave membership,
      billing, and permissions unnamed. Structure means those decisions are
      written as checks an implementation can satisfy or fail, and the next
      session can read the same checks.
  - question: "What should the model still decide?"
    answer: >
      Leave room for file layout, helper names, and the choice among libraries
      that meet a stated constraint. Take back anything that changes who can
      do what, what is stored, or what 'done' means for a user. Those are
      product decisions.
  - question: "Where should the spec live during implementation?"
    answer: >
      Keep it in the repository, next to the code, and pass that path to the
      agent. A spec that exists only in a chat transcript is invisible to the
      next session. A live workspace can also expose the same document to the
      editor over the Model Context Protocol.
---

## The decision a silent spec hands to the model

An agent will fill a blank. Ask for "teams, so a company can invite coworkers" and the model has to choose what a team is, who may invite, what happens when someone leaves, and whether an email domain is enough to join. It will choose. The code will compile. The choice will look like an ordinary design because the model has seen thousands of ordinary designs.

That is the move vibe coding makes. The phrase entered wide use in early 2025 after Andrej Karpathy used it for a style of building where you describe an outcome, accept the model's edits, and do not keep a full mental model of the result. He treated that style as a fit for throwaway projects. On a product other people have to operate, the same style has a specific failure: the unstated decisions accumulate, and they do not agree with each other.

A structured PRD is the counter-move. It is not a longer prompt and it is not a pitch. It is the set of decisions you are unwilling to let a later session reopen. The [guide to writing a PRD an LLM can execute](/blog/how-to-write-prd-for-llm) goes section by section. This essay is about why those sections exist, using one feature that looks small until three sessions touch it.

## A worked example: three membership rules

Picture a B2B workspace. The first session gets a loose prompt: "Add teams so customers can invite their coworkers." A plausible implementation appears.

- A `teams` table, with `name` and `owner_id`.
- A `team_members` table, with `team_id`, `user_id`, and a role of `admin` or `member`.
- An invite creates a user if needed and inserts a member row.
- The owner is whoever created the team.

It runs. Stakeholders can click through an invite. The second session, a week later, gets "add billing per seat." The context window holds the billing task and a slice of the users table. It does not reliably re-read the membership model. A second plausible implementation appears.

- An `organizations` table.
- `users.org_id`, and the person who pays is `org.admin_user_id`.
- Seat count is `count(users where org_id = ?)`.
- Invites are something only the org admin can send, enforced in the new billing UI and nowhere else.

The third session gets "add SSO." It has seen products where the email domain is the company. It adds a third rule: on login, if the domain matches a verified domain, create a membership automatically.

Nothing crashed. The repository now contains three answers to "who is in this company?"

1. A row in `team_members`.
2. A non-null `users.org_id`.
3. An email domain that matches a team setting.

An employee who is removed in the admin screen loses the member row and keeps the `org_id`. The next morning SSO logs them in and the domain rule inserts a fresh member row. Billing still counts them, because the seat query never looked at `team_members`. Support sees a person who "cannot be removed." The bug is not a null pointer. It is three product decisions that were never written down, each one locally reasonable.

This is an illustrative design, not a customer report. The shape is the point. Session-scoped generation optimizes for a coherent answer to the prompt in front of it. It has no duty to the decisions a previous session already made, unless those decisions are in the context as constraints.

## What "structured" has to pin down

A narrative PRD can describe this feature as "workspace admins invite colleagues, and billing follows the team." A human product manager hears the intent and asks about removals, domains, and seats. A model hears permission to proceed. Structure is the part you add so the model is not the one who asks, or worse, the one who answers silently.

For the workspace feature, the spec has to pin at least these:

**One noun for the container.** Call it a workspace. Say that "team" and "organization" are not separate aggregates in this version. If you need both later, that is a new spec, not a new table invented beside the old one.

**One membership record.** A person is in a workspace only when a `workspace_members` row says so. The row has a role (`owner`, `admin`, `member`) and a status (`invited`, `active`, `removed`). Email domain does not grant membership. Domain match can suggest a workspace on the login screen. The person still needs a row.

**One writer for "who is in."** Name the module allowed to insert, activate, and remove members. Routes call it. SSO calls it. The billing UI calls it. A second writer is a bug, even if both writers are correct today.

**The seat rule, in the same words as the membership rule.** Seats are rows where `status = active`. Removed rows stay for audit and do not count. Invited rows do not count. There is no second formula on the users table.

**The removal invariant.** After a member is removed, every workspace route rejects them, SSO does not recreate the row, and billing stops counting them on the next invoice calculation. One test can express that sentence.

**The non-goals.** Write what this version will not do. No nested teams. No automatic join by domain. No separate "organization" object. Non-goals are how you stop a helpful session from adding the feature a similar product had.

That list is the antidote. It is short compared with the code, and it removes the forks. The model can still write the SQL, the route handlers, and the form. It cannot quietly introduce a second meaning of membership, because the second meaning fails the invariant.

## A spec fragment an agent can follow

The same decisions, written as something you can drop in the repo:

```text
Feature: Workspace membership

Aggregate: Workspace
Membership row: workspace_members
  workspace_id, user_id, role (owner|admin|member), status (invited|active|removed)

Invariant:
  A user can access a workspace route only when a row exists
  with status = active. No other table grants access.

Seat count:
  count(workspace_members where workspace_id = ? and status = active)

Domain hint:
  A verified domain may be shown as "Request to join {workspace}".
  It must not insert a membership row.

Removal:
  status flips to removed. The row is kept.
  A later SSO login must not create a new active row for that pair.
  Only WorkspaceMembership.transition() may change status.

Non-goals:
  nested teams, a separate organizations table, domain auto-join.

Errors:
  WORKSPACE_NOT_MEMBER -> 403
  WORKSPACE_ROLE_FORBIDDEN -> 403
  WORKSPACE_INVITE_EXPIRED -> 409
```

Hand that fragment to an agent with the instruction "implement this, and do not add a concept it does not name." Review the diff against the invariant, not against your memory of what you meant. If the diff adds `users.org_id` as an access check, the diff is wrong even when the code is tidy.

The [prompt-architecture guide](/blog/how-to-write-prd-for-llm) expands each of those lines into schemas, routes, and acceptance checks. The fragment above is the spine those sections hang on.

## What you still leave open

Structure is not a demand that the model stop thinking. Pin the product, and leave the implementation choices that do not change behavior:

- Whether the membership check is a SQL join or a query helper, as long as every route uses the same helper.
- How the invite email is rendered, as long as the token is single-use, stored as a hash, and expires.
- Which migration tool runs, as long as the tables and the unique key `(workspace_id, user_id)` exist.

Write those freedoms down too. "You may choose the mailer" is a constraint. Silence is an invitation to add a queue, a second provider, and a preferences system nobody asked for.

Also write the acceptance check as an observable, with values. "Given Ada is `removed` at Workspace North, when Ada presents a valid session and requests `GET /workspaces/north`, then the response is 403 `WORKSPACE_NOT_MEMBER` and no new `workspace_members` row exists." A model can turn that into a test. "Removal should feel immediate" cannot be turned into a test, so it will be turned into whatever the session thinks "immediate" means.

## Keep the spec where the next session will see it

A spec that lives in a doc tool nobody pastes from is a spec the agent does not have. Put the file in the repo at a stable path, such as `specs/workspace-membership.md`, and start the session by naming that path. If your editor supports the [Model Context Protocol](/blog/what-is-model-context-protocol-mcp), the stronger version is a server that exposes the spec as a resource, so the model reads the current file instead of a paragraph copied last Tuesday.

The failure mode to watch is drift between the file and the code. When a review accepts a behavior the spec forbids, update the spec in the same change, or reject the change. A stale spec is a second source of truth, and agents believe the source you put in context. If the file says "domain does not join" and the code auto-joins, the next session will "fix" the code back, or "fix" the file forward, depending on which one it read.

## How the products split this work

[Specifys AI](https://www.specifys-ai.com/) is the specification step: guided workflows that produce a PRD with schemas, API contracts, state machines, and architecture notes, exported for Cursor, Claude, or GPT. The point of the export is the structure above, not a prettier essay.

[GreenPRD](https://greenprd.com) keeps that kind of spec on a visual canvas and syncs the canvas, the Markdown, and the code scaffold. Its MCP server is how Cursor and Claude Desktop read the workspace without a fresh paste.

[Rift Code](https://rift-code.com/) is how you check the claim. After a few sessions, the membership rule should have one writer. A map of the repository shows whether the billing UI, the SSO callback, and the invite route all land on the same function, or whether a second path appeared while everyone was looking at the diff.

[AdPulse](https://www.adpulse-studio.com) is the same discipline on the creative side. A campaign generator that does not receive the product's actual actors, constraints, and language will invent a brand the way a coding agent invents a second membership model. The product context hub is the spec for that loop. The [product overview](/products) shows how the four sit together.

The [vibe-coding essay](/blog/vibe-coding-trap-ai-technical-debt) follows what the debt looks like once the forks are already in the tree, including a payments example where two writers mark an order paid. Read this piece when you are about to start. Read that one when the tree already disagrees with itself.
