---
title: "The Vibe Coding Trap: Why AI-Generated Code Sprawl and Technical Debt Happen"
slug: "vibe-coding-trap-ai-technical-debt"
excerpt: "Vibe coding accepts unread model diffs. On a system you maintain, those diffs fork the architecture: two ways to mark an order paid, and no single place that owns the rule."
summary: "Vibe coding accepts model diffs faster than the decisions inside them get written down, and the debt is contradictory architecture rather than slow typing."
date: "2026-05-24"
updated: "2026-11-04"
category: "Engineering Leadership"
targetProductCTA: "specifys"
related:
  - structured-prds-antidote-vibe-coding
  - how-to-write-prd-for-llm
  - visual-architecture-maps-cognitive-load
relatedProducts:
  - specifys
  - riftcode
  - adpulse
tldr: >
  Vibe coding means accepting model-written changes faster than you can name
  the decisions inside them. The debt is inconsistent architecture: two ways
  to record a payment, no single function that enforces the rule, and a
  repository nobody can replay. The brake is a written spec the next session
  has to follow, plus a map of the code already generated so the
  contradictions are visible.
faq:
  - question: "What is vibe coding?"
    answer: >
      Vibe coding is building by describing an outcome to a model and
      accepting the edits, including edits you have not fully read. The name
      was popularized by Andrej Karpathy in early 2025, and he framed the
      style as a fit for throwaway projects. The trap is using it on a system
      that has to be maintained.
  - question: "Why does the architecture fork if the model is the same each time?"
    answer: >
      Each session is conditioned on the prompt and the slice of the repo in
      context. A later session often does not see the pattern an earlier
      session picked. For any task there are many valid patterns, so the
      model picks a fresh one unless the spec forbids the others.
  - question: "Is technical debt just messy code?"
    answer: >
      Ward Cunningham introduced the debt metaphor in 1992 for shipping a
      design that lags your current understanding, with a plan to reconcile
      it as you learn. AI sprawl often has no note to reconcile against,
      because the understanding was never written down. The code can be tidy
      and still be debt.
  - question: "How do you stop the next session from adding a second pattern?"
    answer: >
      Put a canonical data model, a single writer for each important state,
      and an error catalog in the repo, and tell the agent those are
      constraints. Review the diff for new writers and new nouns. A map of
      the repository makes the second writer visible when the diff looks local.
---

## Speed is real. The missing decisions are the cost.

A developer opens an agent, types a loose description, and watches a feature appear. It compiles. It runs. The demo looks like the product. That speed is not imaginary, and it is not the problem. The problem is what the session decided while producing the speed: names, states, writers, and failure behavior nobody reviewed, because the diff was accepted as a whole.

The name for that style, vibe coding, spread after Andrej Karpathy described it in February 2025. The description was specific. You talk to the agent, you accept the changes, you paste errors back in, and you stop holding the whole program in your head. He presented it as amusing for throwaway work. A maintained system has a different requirement. Someone has to know which rule is the rule.

This essay is about how the debt actually forms. It uses a payments flow as a worked example. It is an illustration of the mechanism, not a claim about any particular team or any measured failure rate. The companion essay on [structured PRDs](/blog/structured-prds-antidote-vibe-coding) shows the membership version of the same fork. The [writing guide](/blog/how-to-write-prd-for-llm) is the checklist that keeps the next session from opening a new fork.

## What the model is doing on each prompt

A coding agent is not a teammate with yesterday's design meeting in memory. A session conditions on the prompt, the files you attached or it opened, and the instructions in context. Outside that window, earlier decisions exist only as code the session may not open.

Four properties follow from that, and they are enough to grow sprawl:

**The session does not inherit a pattern unless you put the pattern in context.** Last week's checkout code can sit unread while this week's refund code chooses a different status enum.

**Many patterns are valid.** "Record that the customer paid" can be a column on the order, a row in a ledger, a webhook handler, or a success-URL redirect. All four appear in real codebases. A model asked to "handle payments" will pick one that fits the prompt. A later prompt picks another.

**The model completes.** Training favors a finished answer. If the prompt does not say what a duplicate webhook should do, the session invents a behavior and moves on. It will not pause to ask whether the event id is the idempotency key.

**Context is a slice.** A large repo does not fit in the window. The slice in front of the model is the slice that gets coordinated. Everything else is a stranger's code, including code the same model wrote on Tuesday.

None of this requires a bad model. It requires an unspecified product.

## A worked example: two writers for "paid"

Session one: "Add checkout." The agent creates an `orders` table with `status` as a string, default `pending`. The success redirect of the hosted checkout page sets `status = paid` and sends the receipt email. The demo works if the shopper returns to the site.

Session two: "Handle failures and late payments." The agent adds a webhook. On a payment event it sets `status` from a different vocabulary: `succeeded`, `failed`, `requires_action`. It does not delete the success-redirect writer. Orders can now be `paid` or `succeeded`, and a shopper who closes the tab before the redirect stays `pending` even when the webhook fired, or flips to `succeeded` and then gets overwritten back to `paid` if the redirect arrives later. The receipt sends twice when both paths run.

Session three: "Add refunds." The agent inserts a new order with a negative amount and `status = refunded`, because a negative line is a pattern it has seen. The original order stays `paid`. Revenue reports that sum `orders.amount where status in (paid, succeeded)` are now short by the refund, or double-count, depending on which status the query remembers. Inventory was decremented on the redirect and is not restored, because the refund path never called the stock function. The webhook is retried by the provider, the handler is not idempotent, and a second delivery decrements stock again on a code path someone added "just in case" during session two.

Read as a story, it sounds careless. Read as three local completions, it is the default. Each session solved the sentence it was given. No session was given the sentence "exactly one function may mark an order paid, and the key is the provider event id."

## The debt, named precisely

Ward Cunningham introduced the technical-debt metaphor in 1992. The original point was narrow: you sometimes ship a design that does not yet reflect your best understanding, and you treat the gap as a loan you intend to repay by refactoring as you learn. The metaphor assumes there is an understanding to repay toward.

Vibe-coded sprawl often fails that assumption. The understanding was never written down. There is no note that says "paid is a ledger entry, the webhook is the only writer, refunds are their own rows." There is only code that contradicts itself while looking finished. Paying the debt back then starts with archaeology. Someone has to decide which of the three behaviors was the product, and the repository cannot answer.

The practical symptoms are boring and specific:

- Two enums for one lifecycle.
- Two or more writers for one column.
- A report query that hard-codes a subset of the enum.
- A side effect (email, stock, ledger) that runs on one path and not the other.
- A retry that repeats the side effect because the handler keyed on nothing stable.

Tidy formatting does not retire any of those. A linter will not notice that `paid` and `succeeded` are the same idea.

## Five constraints that close the forks

You do not need a heavy process to stop this. You need the decisions the sessions were improvising, written where the next session will read them.

**Canonical data model.** One order. Status is an enum: `pending`, `paid`, `fulfilled`, `refunded`, `canceled`. No second vocabulary. Amounts are non-negative. Refunds are rows in `refunds`, not negative orders.

**A single writer.** Only `Orders.markPaid(orderId, providerEventId)` may move an order to `paid`. The redirect calls it. The webhook calls it. Both pass the same event id. The function inserts that id into `payment_events` under a unique key and returns success if the id is already there. The receipt and the stock decrement run inside that function, after the insert, so a retry does not repeat them.

**Module boundaries.** The provider adapter verifies signatures and parses events. It does not send email. The order module does not know which provider it is talking to beyond the port you named. A session that "just handles it in the controller" is crossing a boundary you wrote down.

**Error catalog.** `PAYMENT_SIGNATURE_INVALID` is a 400 and is not retried. `PAYMENT_EVENT_DUPLICATE` is a 200, because the provider should stop retrying. `ORDER_NOT_FOUND` is a 404 and alerts. Invented `try/catch` blocks that log and continue are how a failed signature still marks an order paid.

**Acceptance checks with values.** "Given event `evt_1` has been applied, when the same event is delivered again, then stock is still decremented once, one receipt exists, and the order status is `paid`." That sentence is a test. "Make webhooks reliable" is a vibe.

The [PRD writing guide](/blog/how-to-write-prd-for-llm) turns this list into schemas and request shapes. [Specifys AI](https://www.specifys-ai.com/) is the tool we build for producing that document before the agent writes the handlers: typed models, API contracts, state machines, and export into the editor.

## Seeing the second writer

A diff of the refund session shows a new file and a few edited lines. It does not show that the success redirect and the webhook both write `orders.status`. You can find that with search, if you already know to search for it. A map makes the edge the thing you see first.

[Rift Code](https://rift-code.com/) connects to GitHub and draws the structural map: architecture, dependencies, and review signals aimed at onboarding and at the question "what else does this touch?" The [cognitive-load essay](/blog/visual-architecture-maps-cognitive-load) is the method for reading that map, including the limit you should respect: a missing edge is a question, because dynamic calls and framework conventions hide from static analysis. Use the map to list writers. Use the spec to decide which writer is allowed.

## The same trap outside the repo

The mechanism is not unique to application code. A creative tool given "make ads for the product" and no product context will invent the audience, the claim, and the offer. The output looks finished. The brand forks, one campaign at a time. [AdPulse](https://www.adpulse-studio.com) is built around that constraint: a product context hub, audience research, generation, publishing, and a pass back through performance, so the next cycle starts from the product you have rather than from a fresh improvisation.

The coding version and the creative version want the same object. A written description of what is true, kept current, and handed to the generator as a limit. The [product overview](/products) is the short map of which tool holds which part of that object.

If the repository is already in the collapsed state, do not ask an agent to "clean up the architecture" in one prompt. That prompt is how you get a fourth pattern. Pick one state machine, write it down, move writers onto it, and delete the extra vocabulary in the same change. Then the next session has something to obey.
