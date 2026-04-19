# Project: Astrobiologia.com.br

## Overview
A professional journalistic portal covering astrobiology, maintained by Danilo Albergaria. Focuses on news, interviews, and Brazilian research in life in the universe.

## Tech Stack
- **Frontend**: SvelteKit (Svelte 5)
- **Backend**: Appwrite Cloud (Auth, Database, Storage, Functions, Sites)
- **Styling**: Tailwind CSS 4
- **Deployment**: Appwrite Sites

## Key Commands
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm check`: Type check Svelte components

## Project Rules
- **Aesthetics**: Follow "New Scientist" / "Universe Today" premium scientific design.
- **Simplicity**: Prioritize low maintenance and free tier usage.
- **Language**: Core content is in Portuguese, but the project supports multi-language (i18n).
- **Backend**: Use Appwrite Cloud for all backend needs. Do not introduce self-hosted components.
- **Svelte 5**: Use runes (`$state`, `$derived`, etc.) and modern Svelte 5 patterns.
- **Tailwind 4**: Use Tailwind 4 features and avoid legacy configurations.

## Current Status
- **Active Phase**: Phase 2: Administrative CMS (Articles CRUD).
- **Milestone**: Milestone 1: MVP - Functional Portal & Admin.

## Skills
This project uses the Agent Skills framework for domain-specific guidance.

### GSD Workflow
- **Location**: `.agent/skills/gsd-*`
- **Use when**: Managing project progress, planning phases, and executing tasks.
- **Key principle**: Follow the `discuss -> plan -> execute` workflow.

### leanspec-sdd - Spec-Driven Development
- **Location**: `.github/skills/leanspec-sdd/SKILL.md`
- **Use when**: Working with specs, planning features, multi-step changes.
- **Key principle**: Run `board` or `search` before creating specs.
