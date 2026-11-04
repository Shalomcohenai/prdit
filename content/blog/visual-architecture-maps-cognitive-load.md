---
title: "Visual Architecture Maps: Reducing Cognitive Load on Complex Codebases"
slug: "visual-architecture-maps-cognitive-load"
excerpt: "A file tree shows containment. An architecture map shows the edges a change can travel, so a reviewer can see every writer of a piece of state before reading the diff."
summary: "Architecture maps put dependency and data-flow edges on the screen, which is how a reviewer stops holding a whole service graph in working memory."
date: "2026-05-15"
updated: "2026-11-04"
category: "developer-tools"
targetProductCTA: "riftcode"
related:
  - onboard-massive-github-repo-fast
  - visual-code-reviews-broken-text-diffs
  - vibe-coding-trap-ai-technical-debt
relatedProducts:
  - riftcode
  - specifys
tldr: >
  A file tree shows which folder a file sits in. An architecture map shows
  the edges a change can travel: imports, handlers, tables, and outbound
  calls. Working memory is the wrong place to store that graph while you
  review a diff. Put the edges on the screen, list every writer of the state
  the diff touches, and treat a module with no inbound edge as a question
  rather than as proof it is dead.
faq:
  - question: "What does an architecture map show that a file tree does not?"
    answer: >
      A file tree is a containment hierarchy. A map draws relationships:
      which module imports which, which handler writes which table, and
      which service calls which adapter. Those edges are what a change
      actually travels along.
  - question: "Does a map replace reading code?"
    answer: >
      It tells you which code is worth reading. You still open the writer
      and the invariant. You stop opening dozens of siblings because they
      share a directory with the file in the diff.
  - question: "Can a map prove a module is unused?"
    answer: >
      A module with no inbound edge is a candidate for removal, not a proof.
      Dynamic import, reflection, config-driven wiring, and framework
      conventions hide edges from static analysis. Confirm with a runtime
      reference or a deletion test before you remove it.
  - question: "How does this relate to a PRD?"
    answer: >
      The spec says which writer is allowed. The map says which writers
      exist. The review is the gap between those two lists. A spec alone
      cannot see a second writer that a previous session added.
---

## The graph you are being asked to hold

A reviewer opens a pull request that edits `checkout.ts` and a webhook handler. The file tree says both files live under `src/payments/`. Search says the string `status` appears in forty files. Neither view answers the question the review actually has: if this change marks an order paid, what else marks an order paid, and what runs when that happens?

Answering from text means building a graph in your head. You remember the redirect path, wonder whether the webhook is a second writer, forget the nightly repair job, and approve the diff. The graph was larger than the review slot you had for it. That gap is a cognitive-load problem before it is a tooling problem.

John Sweller's cognitive load theory separates three kinds of load. Intrinsic load is the complexity of the material itself. A payments lifecycle with refunds and retries is intrinsically hard. Extraneous load is the cost added by the way the material is presented. A flat diff of two files, with the other writers off-screen, is extraneous load. Germane load is the effort that builds a schema you can reuse next time, such as "orders have one writer, and the event id is the idempotency key." Maps earn their place when they cut the extraneous part, so the review spends its effort on the schema.

George Miller's 1956 paper is about the span of absolute judgment and immediate memory. It is often flattened into a slogan about holding seven items. You do not need the slogan. A service graph of writers, tables, and side effects is already more than a person can rehearse accurately while also reading a diff. Externalize the graph.

## What a map has to draw

A useful architecture map is not a poster of every file. It is a small set of edge types you can point at during a review:

- **Import or call edges.** Module A invokes module B. Weight can be "number of call sites," so a helper used everywhere looks different from a helper used once.
- **Entry points.** HTTP routes, queue consumers, cron handlers, CLI commands. Onboarding starts here, because this is how the process actually begins.
- **Data edges.** Which function writes which table or collection, and which function only reads it.
- **Outbound edges.** Calls that leave the process: the payments provider, mail, object storage.
- **Absent edges.** A node with nothing coming in. Treat it as a question.

[Rift Code](https://rift-code.com/) is the product we build for this. It connects to GitHub and generates structural maps, dependency views, review signals, and onboarding walkthroughs, including dead-code candidates. The rest of this essay is the method for reading that kind of map. The [onboarding guide](/blog/onboard-massive-github-repo-fast) is the same method aimed at a first week in a large repo. The [visual review essay](/blog/visual-code-reviews-broken-text-diffs) is aimed at the pull request itself.

## A worked reading: who marks an order paid

Use the payments fork from the [vibe-coding essay](/blog/vibe-coding-trap-ai-technical-debt) as the picture. The spec, if it existed, would say one function may move an order to `paid`. The map of the generated repo shows something else. Read it in layers. This is an illustrative graph, the way a map should look when the forks have already landed.

**Layer 1, entry points.** Three nodes light up as entries: `POST /checkout`, the provider webhook, and `jobs/reconcile-orders` on a schedule. A file tree would have buried the job under `scripts/`. The map shows it because it is an entry, not because of its folder.

**Layer 2, writers.** Draw only the edges that perform a write to `orders.status`. You see three: the success redirect inside the checkout controller, the webhook handler, and the reconcile job, which sets `paid` when it finds a mismatch. The diff you were asked to review touches the webhook. The map tells you the review is incomplete until you have looked at the other two writers.

**Layer 3, side effects.** From each writer, draw edges to "send receipt," "decrement stock," and "insert payment_events." In this picture the redirect sends the receipt and decrements stock. The webhook decrements stock and does not send mail. The job does neither. A retried webhook double-decrements. You can see that without opening every line, and you now know which lines matter.

**Layer 4, the noun.** Color `paid` and `succeeded` as values written into the same column. The map does not understand English, so this layer is an annotation you add once you notice the two strings, or a saved query that shows every assignment to `orders.status`. The value of the picture is that both strings are visible in one place.

The review comment writes itself. "Three writers. Spec allows one. Receipt and stock run on different paths. Please route all three entries through `Orders.markPaid`, and key the side effects on the provider event id." You did not hold the graph in memory. You read it off the screen, which is the load shift.

## A repeatable way to read any change

Use the same four questions whenever a diff is more than a typo. They fit a checkout, a permission change, or a new queue consumer.

1. **Which state does this change write?** Name the column, the document, the cache key. If the answer is "none," say what observable behavior changes instead.
2. **Which other nodes write that state?** Read them off the map. Open those nodes, not the neighboring files in the directory.
3. **Which side effects fire, and on which path?** Mail, money, stock, analytics, cache invalidation. A path that skips one is a product bug even when both paths set the same status.
4. **Which spec sentence covers the writer list?** If you have a PRD, the allowed writer is one line. [Specifys AI](https://www.specifys-ai.com/) is where that line gets written as a contract before the code exists. The map without a spec tells you the writers. The spec without a map tells you the intention. The review is the comparison. The [product overview](/products) is the index of the tools in that loop.

Onboarding uses the same questions in a different order. Start at the entry points, walk one hop, write down the boundaries, then the stores, then the side effects. Stop when you can narrate a single request without opening a file at random. The map is what makes "one hop" a glance instead of a search session.

## Limits you should not bluff past

Static structure misses real edges. If you treat the picture as complete, you will delete something the framework loads by convention.

- **Dynamic import and computed paths.** `import(dir + name)` does not always resolve to a node.
- **Reflection and dependency injection.** A container that constructs every class in a package creates edges the import graph does not show.
- **Framework conventions.** A file named `route.ts` in a certain folder is an entry point because of the framework, not because something imports it. The map has to know the convention or you have to add those entries yourself.
- **Data-driven wiring.** A row in `feature_flags` or a queue name in config connects two services. That edge is not an import.
- **Cross-repository calls.** HTTP between two repos is an edge. A map of one repo ends at the client. You still want that node drawn, labeled as external.

So a node with no inbound edge is a candidate. Confirm with a deletion in a branch and a test run, or with a log that shows the module loaded in production, before you call it dead. Tools that advertise dead-code detection, including Rift's, are input to that check. They are not the check itself.

Also resist the poster. A map of every function in a hundred-thousand-line repo is a second codebase. Collapse by boundary. Show services, modules, and tables first. Expand the neighborhood of the diff you are reviewing. The point is a graph you can take in during the review, not a diagram that needs its own onboarding.

## What this changes in the room

The review meeting gets shorter when the first artifact is the writer list rather than the diff. People argue about whether a second writer is allowed, which is a product question, instead of arguing about whether a second writer exists, which is a fact the map already settled. New engineers get the entry points on day one. The [onboarding essay](/blog/onboard-massive-github-repo-fast) walks that first day. The spec, maintained on purpose, keeps the next agent session from adding writer number four.

Maps do not make a difficult domain simple. Payments stay intrinsically hard. They take the extraneous hunt out of the review, so the hard part is the part you meant to spend the afternoon on.
