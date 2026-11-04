---
title: "How to Write a PRD That LLMs Actually Understand (The Prompt Architecture Guide)"
slug: "how-to-write-prd-for-llm"
excerpt: "Fill in constraints, schemas, contracts, state, errors, and acceptance checks before an agent edits the repo. A worked password-reset spec shows the level of detail."
summary: "An LLM-ready PRD fills the free variables: constraints, typed entities, contracts, a state machine, an error catalog, and acceptance checks with values."
date: "2026-05-25"
updated: "2026-11-04"
category: "AI Specifications"
targetProductCTA: "specifys"
related:
  - structured-prds-antidote-vibe-coding
  - vibe-coding-trap-ai-technical-debt
  - what-is-model-context-protocol-mcp
relatedProducts:
  - specifys
  - greenprd
  - adpulse
tldr: >
  An LLM-ready PRD closes the free variables in a feature: runtime and
  security constraints, typed entities, request and response shapes, a state
  machine, an error catalog, and acceptance checks that use concrete values.
  A narrative user story leaves those variables open, and the model will
  close them on its own. The password-reset spec below is a complete example
  of that closure.
faq:
  - question: "Which sections does an LLM-ready PRD need?"
    answer: >
      Six: system constraints, typed data models, API contracts for every
      response you care about, a state machine for the record, an error
      catalog with codes, and acceptance checks in Given/When/Then with real
      values. A feature can be small and still need all six.
  - question: "Can I paste a human PRD into Cursor or Claude and edit the gaps later?"
    answer: >
      You can, and the gaps get filled during generation. Editing afterward
      means unwinding decisions that are already in the schema and the tests.
      Close the variables in the spec, put the file in the repo, and point
      the session at the file.
  - question: "How specific should numbers in the spec be?"
    answer: >
      Specific enough to implement and test. Token length, TTL, and rate
      limits in this guide are example policies for the sample feature, chosen
      so the agent has a value. They are not presented as industry benchmarks.
      Pick your own values and write them down.
  - question: "How does the spec stay attached to the editor?"
    answer: >
      Commit it beside the code and name the path in the session. When the
      editor speaks the Model Context Protocol, a server can expose the spec
      as a resource so the model reads the current document instead of a
      pasted copy.
---

## The variables a narrative leaves open

A PRD written for a human team can say "users can reset a forgotten password, securely, without locking out the real owner." A human engineer asks how long the link lives, whether the response reveals that an email is registered, and what happens to existing sessions. Those questions are the spec.

A coding agent does not reliably ask. It closes each open variable with a common pattern and continues. Sometimes the pattern is fine. Sometimes the response body includes "no account for that email," and you have shipped an account-existence oracle. Sometimes the token is the user id plus a timestamp, and anyone who can guess the shape can reset the account. The model did not misbehave. The spec left the security property unnamed, so a property got invented.

Prompt architecture is the habit of naming those properties before the session starts. The [structured PRD essay](/blog/structured-prds-antidote-vibe-coding) explains why the forks hurt. The [vibe-coding essay](/blog/vibe-coding-trap-ai-technical-debt) shows the same fork in a payments flow. This guide is the template, filled in for one feature end to end.

The numbers below are the example's policy. Use them as a picture of the required precision. Replace them with the values your threat model actually wants.

## What changes when the spec is a table

| Open variable | Narrative line | Instruction the model can follow |
|---|---|---|
| Scope | "Add password reset" | Two routes only: request and confirm. No magic-link login. No security questions. |
| Account leak | "Be secure" | Both registered and unknown emails return 202 with the same JSON body. |
| Token | "Send a link" | 32 random bytes, store the SHA-256 hash only, TTL 30 minutes, single use. |
| Sessions | "They get back in" | A successful reset revokes every refresh session for that user. |
| Abuse | "Don't allow spam" | 5 requests per email per hour, 20 per IP per hour. Over the limit: 429, no mail sent. |

Every cell in the right column deletes a guess. That is the whole method.

## Section 1: Constraints and boundaries

Write the hard edges before the happy path. For this example:

- Runtime: server route handlers on Node. The token generator uses the platform CSPRNG (`crypto.randomBytes` or the equivalent), not `Math.random`.
- Mail: one outbound mail port. The handler depends on the port, not on a specific vendor SDK.
- Timing: the request handler does not wait on the mail vendor's success to choose its HTTP status. It records the token, enqueues the send, and returns 202. A failed send is retried by the mail worker and does not change the response the client already received.
- Data: the user table already exists with `id` and `email`. This feature adds a reset table. It does not add a second user model.
- Browser: the reset page reads the token from the URL fragment or a query string and immediately POSTs it. The page does not log the token.

If a constraint is "we are still choosing," say so, and say what the agent must not assume. "Mail vendor is undecided; code against the port; do not import a vendor SDK" is a constraint. Silence becomes an SDK import.

## Section 2: Typed entities

```text
PasswordReset
  id: uuid
  user_id: uuid, indexed
  token_hash: char(64), unique
  expires_at: timestamptz
  used_at: timestamptz, nullable
  created_at: timestamptz
  request_ip: text

Rules
  token_hash is hex-encoded SHA-256 of the raw token.
  The raw token is never stored and never logged.
  A row is usable when used_at is null and expires_at is in the future.
  Creating a new reset sets used_at = now() on older unused rows for that user.
```

Relationships stay in the same block. `user_id` references `users.id`. Deleting a user deletes reset rows. Email match uses the normalized address already stored on the user, so the reset flow does not invent a second normalization.

## Section 3: Contracts

Two routes. Write every response you intend to support, including the ones that exist to look identical.

```text
POST /api/password-resets
  body: { "email": string }
  202: { "status": "accepted" }
  429: { "error": "RATE_LIMITED", "retryAfterSeconds": number }
  400: { "error": "EMAIL_INVALID" }

POST /api/password-resets/confirm
  body: { "token": string, "password": string }
  200: { "status": "reset" }
  400: { "error": "PASSWORD_TOO_SHORT", "minLength": 12 }
  400: { "error": "TOKEN_INVALID" }
  409: { "error": "TOKEN_USED" }
  409: { "error": "TOKEN_EXPIRED" }
```

`TOKEN_INVALID` covers unknown tokens, malformed tokens, and tokens whose user was deleted. The client copy can say "This link is no longer valid." The code keeps a distinct `TOKEN_USED` and `TOKEN_EXPIRED` for logs, because an operator debugging a spike wants the difference, and an attacker reading the client does not need a sharper oracle than "not valid." If you would rather collapse those two into `TOKEN_INVALID` in the response as well, write that down. The point is to choose, not to let the session choose a different code in each handler.

Authentication: the request route is public. The confirm route is public and carries its authority in the token. A logged-in session is not required and is not created by this flow. Say that, or the agent will helpfully sign the user in and set a cookie with a lifetime it invented.

## Section 4: The state machine

Talk about the reset row as states, not as a paragraph.

```text
(none) --request--> pending
pending --confirm--> used
pending --new request for same user--> superseded
pending --now > expires_at--> expired

pending: stored, mail enqueued, not yet successfully confirmed
used: password replaced, refresh sessions revoked, used_at set
superseded: used_at set because a newer request won, password unchanged
expired: no write required; the check is expires_at
```

Side effects belong on the transition, not on "the feature." The `pending -> used` transition, in one database transaction: set `used_at`, set the new password hash, revoke refresh sessions. Mail is not a side effect of confirm. Mail is a side effect of entering `pending`.

A model given this machine will not also "expire tokens with a nightly job" unless you ask for one. You do not need the job. The read path enforces `expires_at`.

## Section 5: Error catalog

| Code | Where it is returned | What is logged | What the user can do |
|---|---|---|---|
| `EMAIL_INVALID` | Request, failed format check | Nothing sensitive | Correct the address |
| `RATE_LIMITED` | Request, over the example budget | ip, normalized email hash, counter | Wait for `retryAfterSeconds` |
| `PASSWORD_TOO_SHORT` | Confirm | user id only | Pick a longer password |
| `TOKEN_INVALID` | Confirm | hash prefix only, never the raw token | Request a new link |
| `TOKEN_USED` | Confirm | reset id | Request a new link |
| `TOKEN_EXPIRED` | Confirm | reset id | Request a new link |

The catalog is also a ban list. Any error string that is not in the table is a review comment, even when the status code is reasonable. "Invalid token!!!" and `TOKEN_INVALID` are different products to the client.

## Section 6: Acceptance checks

Write checks the way a test reads, with values.

1. Given no user for `ada@example.com`, when the client POSTs that email, then the response is 202 `{ "status": "accepted" }`, no row is created, and no mail is enqueued.
2. Given a user for `ada@example.com`, when the client POSTs that email, then the response is the same 202 body, one `pending` row exists, the stored hash is not equal to the raw token, and exactly one mail job is enqueued.
3. Given five successful requests for `ada@example.com` in the last hour, when a sixth arrives, then the response is 429 and no additional mail job is enqueued.
4. Given a pending token whose `expires_at` is 30 minutes from creation, when confirm is called at 31 minutes with a 12-character password, then the response is 409 `TOKEN_EXPIRED` and the password hash is unchanged.
5. Given a pending token, when confirm is called with password `short`, then the response is 400 `PASSWORD_TOO_SHORT` and the row stays pending.
6. Given a pending token, when confirm succeeds, then the password hash changes, every refresh session for that user is revoked, `used_at` is set, and a second confirm with the same token returns 409 `TOKEN_USED`.

Six checks. An agent that has them will generate tests that match the product, and a reviewer can reject a shortcut that returns 404 for an unknown email because check 1 forbids the oracle.

## How to hand the file to the agent

Commit the spec at a stable path, for example `specs/password-reset.md`. Start the session with the path and one line: "Implement this spec. Do not add routes, states, or error codes it does not list." When a review accepts a behavior the spec does not describe, change the spec in the same pull request.

Pasting the spec into a chat works once. The paste goes stale the moment the file changes. Editors that speak MCP can read the file as a resource on each run. The [MCP guide](/blog/what-is-model-context-protocol-mcp) covers the host, the server, and the handshake. [GreenPRD](https://greenprd.com) is the workspace we ship for this: the spec is edited on a canvas, the Markdown stays in sync, and a native MCP server lets Cursor and Claude Desktop read it.

Writing the six sections by hand is the skill. [Specifys AI](https://www.specifys-ai.com/) is the tool for producing them from a product intent when you want the schemas, contracts, error taxonomy, and test criteria generated as one consistent document and exported to the editor. The export is only useful if you treat it as the constraint file above, and if you edit it when the product changes.

The same fields are the product context a creative workflow should consume. If the generator does not know the actor, the offer, and the words you refuse to say, it will invent them. [AdPulse](https://www.adpulse-studio.com) starts from a product context hub for that reason. The [overview of the products](/products) is the index.

## A review checklist you can apply tomorrow

Before you let a session edit the repo, confirm the spec answers these in writing:

- What is explicitly out of scope?
- Which table is the source of truth, and who is allowed to write it?
- What is the response for the "does not exist" case, and does it match the "does exist" case when a leak would matter?
- What is the idempotency key for any retryable side effect?
- Which error codes exist, and which strings are forbidden?
- Which Given/When/Then fails if the model takes a shortcut?

If one of those is blank, the session will fill it. Fill it yourself first.
