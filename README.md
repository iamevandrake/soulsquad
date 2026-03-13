<p align="center">
  <h1 align="center">Soulsquad</h1>
  <p align="center"><strong>AI marketing agency platform</strong></p>
</p>

<p align="center">
  <a href="#quickstart"><strong>Quickstart</strong></a> &middot;
  <a href="https://github.com/iamevandrake/soulsquad"><strong>GitHub</strong></a>
</p>

<p align="center">
  <a href="https://github.com/iamevandrake/soulsquad/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a>
  <a href="https://github.com/iamevandrake/soulsquad/stargazers"><img src="https://img.shields.io/github/stars/iamevandrake/soulsquad?style=flat" alt="Stars" /></a>
</p>

<br/>

## What is Soulsquad?

# Your AI marketing team, ready to go

**Soulsquad is a consumer-friendly marketing platform powered by AI agents.** Sign in with Google, pick an agent team template, bring your own API key, and let your AI marketing squad handle the rest.

Built on [opensoul](https://github.com/iamevandrake/opensoul) (the open-source agentic marketing stack) and [Paperclip](https://github.com/WeAreBini/paperclip).

|        | Step              | Example                                                                          |
| ------ | ----------------- | -------------------------------------------------------------------------------- |
| **01** | Sign in           | Google OAuth — one click to get started                                           |
| **02** | Pick your squad   | Choose a pre-built team: Launch Campaign, Content Engine, or Full Agency          |
| **03** | Watch them work   | Your AI agents execute campaigns, create content, and grow your brand             |

<br/>

## Agent Team Templates

Soulsquad comes with pre-built agent team templates:

| Template | Agents | Best For |
| --- | --- | --- |
| **Launch Campaign** | 4 agents | Product launches, campaign sprints |
| **Content Engine** | 3 agents | Ongoing content production |
| **Full Agency** | 6 agents | Complete marketing operations |

Each agent runs autonomously on scheduled heartbeats. They check their work queue, execute tasks, and report progress.

<br/>

## Features

<table>
<tr>
<td align="center" width="33%">
<h3>One-Click Setup</h3>
Sign in with Google. Pick a template. Enter your API key. Your marketing team is live in minutes.
</td>
<td align="center" width="33%">
<h3>BYOK (Bring Your Own Key)</h3>
Use your own Anthropic API key. You control costs. No markup on AI usage.
</td>
<td align="center" width="33%">
<h3>Pre-Built Teams</h3>
Choose from curated agent team templates designed for common marketing workflows.
</td>
</tr>
<tr>
<td align="center">
<h3>Autonomous Execution</h3>
Agents wake on schedule, check their queue, produce work, and hand off to the next team member.
</td>
<td align="center">
<h3>Campaign Governance</h3>
You're the client. Approve strategies. Review creative. Pause or redirect any agent at any time.
</td>
<td align="center">
<h3>Full Audit Trail</h3>
Every decision, every draft, every revision. Traced and explained. Complete campaign accountability.
</td>
</tr>
</table>

<br/>

## Quickstart

```bash
git clone https://github.com/iamevandrake/soulsquad.git
cd soulsquad
pnpm install
pnpm dev
```

This starts the API server at `http://localhost:3200`. An embedded PostgreSQL database is created automatically. No setup required.

> **Requirements:** Node.js 20+, pnpm 9.15+

<br/>

## Development

```bash
pnpm dev              # Full dev (API + UI, watch mode)
pnpm dev:once         # Full dev without file watching
pnpm build            # Build all
pnpm typecheck        # Type checking
pnpm test:run         # Run tests
```

<br/>

## Architecture

Soulsquad is built on [opensoul](https://github.com/iamevandrake/opensoul) and [Paperclip](https://github.com/WeAreBini/paperclip). It adds a consumer-facing layer on top:

- **Google OAuth** for simple sign-in
- **Agent team templates** for instant setup
- **BYOK API key management** so users control their own AI costs
- **Consumer-friendly dashboard** with simplified navigation

<br/>

## License

MIT &copy; 2026 Simhasana LLC

<br/>

---

<p align="center">
  <sub>Open source under MIT &copy; Simhasana LLC. Built on <a href="https://github.com/iamevandrake/opensoul">opensoul</a> and <a href="https://github.com/WeAreBini/paperclip">Paperclip</a>.</sub>
</p>
