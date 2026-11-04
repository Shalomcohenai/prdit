---
title: "What is Model Context Protocol (MCP)? The New Architecture Saving IDE Workflows"
slug: "what-is-model-context-protocol-mcp"
excerpt: "MCP is the open JSON-RPC protocol that lets an editor discover tools, resources, and prompts from a server, so the spec and the repo are not re-pasted into every chat."
summary: "MCP is an open protocol for hosts to call tools and read resources from servers, which is how a live spec stays attached to the editor."
date: "2026-05-21"
updated: "2026-11-04"
category: "AI Tooling"
targetProductCTA: "greenprd"
related:
  - mcp-revolution-ide-workflows
  - how-to-write-prd-for-llm
  - death-of-prompt-engineering-visual-workflows
relatedProducts:
  - greenprd
  - specifys
  - riftcode
tldr: >
  The Model Context Protocol is an open protocol, published by Anthropic in
  November 2024, that lets a host such as an IDE discover tools, resources,
  and prompts exposed by a server. Messages are JSON-RPC 2.0. Local servers
  usually speak stdio. Remote servers speak HTTP. The practical change is
  that a spec, a repository, or a database can live behind a server the model
  calls, instead of being pasted into a transcript that forgets.
faq:
  - question: "What problem does MCP solve?"
    answer: >
      Models inside an editor start isolated from your files, databases, and
      issue trackers. Before a shared protocol, each integration was custom
      glue. MCP gives the host one way to list and call capabilities a server
      exposes, and to read resources by URI.
  - question: "What is the difference between a tool, a resource, and a prompt?"
    answer: >
      A tool is a function the model can invoke, with a JSON Schema for its
      arguments. A resource is data addressed by a URI that the host can read
      into context. A prompt is a template a person can select. Tools change
      things or compute. Resources inform. Prompts package a workflow.
  - question: "How does a local server connect?"
    answer: >
      The host starts the server as a process and speaks JSON-RPC over
      stdin and stdout. A typical config names a command and its arguments.
      Remote servers use HTTP. The earlier remote style was HTTP with
      server-sent events; the spec later added Streamable HTTP.
  - question: "What should you review before enabling a server?"
    answer: >
      Treat the server like any credentialed integration. Read which tools
      can write or delete, which paths or tenants it can reach, and where
      the secret lives. Keep tokens out of the repository. A filesystem
      server pointed at your home directory is a different risk from one
      pointed at a single project.
---

## The paste problem

An agent in an editor is useful when it can see the spec, the ticket, and the relevant files. The default way to provide them is to paste. The paste is a copy. It goes stale when the spec changes, it crowds the window, and it is different for every person on the team. The next session starts blank unless someone pastes again.

The Model Context Protocol is the open answer to that seam. Anthropic published it in November 2024. The specification and the documentation live at [modelcontextprotocol.io](https://modelcontextprotocol.io). The protocol does not train the model and it does not replace your editor. It standardizes how a host application discovers and calls capabilities that live in a separate server process.

This guide explains the roles, the three core features, the handshake, and a concrete server you could put in front of a PRD. It does not claim adoption counts, and the example server is an illustration, not a product you can `npm install` under the names used here. For how teams compose those tools once they exist, see [how MCP changes day-to-day IDE work](/blog/mcp-revolution-ide-workflows) and [why visual workflows replaced long prompts](/blog/death-of-prompt-engineering-visual-workflows).

## Host, client, server

MCP splits the connection into three roles:

- The **host** is the application the person uses. Claude Desktop and Cursor are hosts with MCP clients. Other editors have added clients since the protocol shipped. The host owns the model conversation and the decision to actually invoke a tool.
- The **client** is the connector inside the host. There is one client per server. It speaks the protocol, holds the session, and surfaces tools and resources to the model runtime.
- The **server** is a program you run, or a remote service you reach, that exposes capabilities. A server might wrap the local filesystem, a database, an issue tracker, or the folder where your specs live.

The host does not need a custom plugin for each of those systems. It needs one client implementation. Each system needs a server. That split is the whole integration story.

## Tools, resources, and prompts

The specification's core features are tools, resources, and prompts. Optional capabilities also exist. Sampling lets a server ask the host to run a model completion, if the host allows it. Roots let a client tell a server which directories it may touch. You can ship a useful server with none of the optional pieces.

**Tools** are model-invoked functions. Each tool has a name, a description, and a JSON Schema for its arguments. The host lists them with `tools/list`. The model asks the host to call one. The host sends `tools/call`. The server returns content, often text or structured data, plus an error flag when the call failed. A tool is allowed to have side effects. That is why a human or a policy in the host should be able to approve calls that write.

**Resources** are data addressed by URI. The server lists them with `resources/list` and returns contents for `resources/read`. A resource is how a spec, a schema, or a runbook stays a document the model can pull, rather than a paragraph frozen in a prompt. Subscriptions exist so a host can refresh when a resource changes. Use a resource for "the current password-reset spec." Use a tool for "run the acceptance checks and return the failures."

**Prompts** are templates the person selects. `prompts/list` and `prompts/get` return a prompt definition, with arguments, that the host can turn into messages. A prompt is a saved workflow ("review this spec against the diff") rather than a capability.

Keeping the three straight matters when you design a server. If you expose the spec only as a tool the model might forget to call, the session can drift. If you expose it as a resource the host attaches up front, the spec is in context before the model plans.

## The handshake

Messages are JSON-RPC 2.0. A session starts with `initialize`. The client tells the server which protocol version it wants, which capabilities it supports, and its name. The server answers with the version it will speak, its capabilities, and its own name. The client then sends an `initialized` notification. If the versions do not overlap, the client disconnects. Do not paper over a mismatch with a private side channel. You will debug two dialects forever.

A minimal initialize request looks like this. The version string is whatever revision your client and server both implement. The first public revision was dated `2024-11-05`. Later revisions extended the remote transport and authorization. Pin a revision on purpose.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "example-host", "version": "0.1.0" }
  }
}
```

After the handshake, a spec server you control might answer `tools/list` with one tool:

```json
{
  "name": "list_acceptance_checks",
  "description": "Return the Given/When/Then checks for a feature spec.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "feature": { "type": "string" }
    },
    "required": ["feature"]
  }
}
```

And `resources/list` might include `spec://password-reset`, with a MIME type of `text/markdown`. When the model needs the current contract, the host reads that URI. When the model needs the checks as data, it calls the tool. The names are examples for a server you would write in front of the password-reset spec from the [PRD guide](/blog/how-to-write-prd-for-llm). They are not built-in methods of the protocol.

## Transports and configuration

A local server is a process. The host launches a command and speaks JSON-RPC through stdin and stdout. A configuration entry names the command and the arguments. The reference filesystem server has been published as `@modelcontextprotocol/server-filesystem`, taking an absolute directory it is allowed to read. Packages move, so confirm the name and the arguments against the official servers list before you pin one.

```json
{
  "mcpServers": {
    "project-files": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/absolute/path/to/repo"]
    }
  }
}
```

The current filesystem package documents Node.js 24 or later when you launch it through npx, and it exposes only the directories you pass as arguments. Point those arguments at the repository, not at a home directory. Put secrets in the environment of the host, or in a secret store the server reads, and keep them out of the committed JSON. A token written into a shared config is a token in git history.

Remote servers speak HTTP. The first remote transport was HTTP with server-sent events. The specification later defined Streamable HTTP as the remote transport, including the session and authorization behavior that a production server needs. When you read a tutorial, check which transport it targets before you copy the snippet. A stdio config and a remote URL are not interchangeable.

Hosts differ in where the JSON lives. Cursor reads project and user MCP configuration. Claude Desktop reads its own config file. The shape of `mcpServers` is the part worth standardizing on your team. Check the current host docs for the file path, because those paths have changed before and will change again.

## A spec server, end to end

Take the password-reset document. A small MCP server in front of the `specs/` directory can do four things and nothing else:

1. Resource `spec://password-reset` returns the Markdown byte for byte.
2. Resource `spec://password-reset/contracts` returns only the route section, so a session that is editing the handler does not have to load the essay around it.
3. Tool `list_acceptance_checks` with `{ "feature": "password-reset" }` returns the six checks as structured text.
4. Tool `check_error_codes` reads a diff or a file path and reports any error string that is not in the catalog. It does not write.

The host attaches the spec resource when a session starts in that repo. The model calls the tools when it is ready to verify. You have replaced the paste with a read. When the spec changes, the resource changes, and the next session sees the new TTL instead of the one somebody pasted last month.

That server is a product decision of its own. It should not also "be helpful" by rewriting the spec when tests fail. A write tool belongs in a separate, explicitly approved capability. Read-only is the right default for a document you consider the source of truth.

## What to review before you turn a server on

MCP removes glue code. It does not remove authority. A server runs with the credentials and the filesystem rights you gave the process. Review these before a team-wide config:

- **Writes.** Which tools can create, update, or delete? Prefer a server that reads until you have a reason.
- **Scope.** A filesystem root, a database role, a tenant id. Narrow it to the project. A role that can `DROP` is not a documentation role.
- **Secrets.** Environment variables injected by the host, not values committed next to the command. Rotate anything that already landed in a dotfile.
- **Output.** Tools should not echo tokens, raw password-reset links, or full customer rows back into the transcript. The transcript gets logged.
- **Approval.** The host should be able to show the tool name and the arguments to a person before a write runs. Auto-approving every call is vibe coding at the tool layer.

If you cannot explain what a server can touch, do not enable it. The protocol will faithfully call whatever the server offers.

## Where this sits in the product loop

[GreenPRD](https://greenprd.com) is the workspace we ship for the spec side of this. A brief becomes a PRD through the product's 7-stage pipeline. You edit flows on a visual canvas, and the canvas, the Markdown, and the code scaffold stay aligned. The native MCP server is how Cursor and Claude Desktop read and update that workspace from the editor, which is the "spec as a resource" pattern above, already hosted.

[Specifys AI](https://www.specifys-ai.com/) produces the structured document: schemas, contracts, state machines, and the export you would point a spec server at. The protocol does not care which tool wrote the Markdown. It cares that the Markdown has a URI.

[Rift Code](https://rift-code.com/) produces the structural map of a GitHub repository. A map is the kind of resource a server can expose ("what calls `Orders.markPaid`") even though the protocol itself does not draw graphs. The [architecture-map essay](/blog/visual-architecture-maps-cognitive-load) is about how to read those edges. The [product overview](/products) puts the tools in one place.

MCP is a narrow standard with a wide effect. The host learns capabilities at runtime. The server stays replaceable. The spec stops being a paste. That is the architecture change. The judgment about which capabilities to expose stays with you.
