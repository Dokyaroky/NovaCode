# NovaCode working preferences

- Inspect the existing implementation before changing it.
- Prefer focused changes over unnecessary refactoring or rewrites.
- Explain the purpose and scope of important changes.
- Run the appropriate tests, builds, linting, and type checks; never claim a check passed without running it.
- Identify risks and breaking changes before taking action.
- Do not run destructive database commands or migrations without assessing necessity and safety.
- Never expose secrets, credentials, API keys, tokens, or private environment values in documentation, logs, or commits.
- Update project documentation after significant milestones, especially `PROJECT_STATE.md`, `WORK_LOG.md`, and `docs/api-contract.md` when relevant.
- Keep `PROJECT_STATE.md` focused on current architecture/status/priorities and `WORK_LOG.md` focused on significant historical work.
- Avoid repeatedly regenerating or reading large documentation files when a small targeted update is sufficient.
- Preserve the more specific instructions in `backend/AGENTS.md` and `frontend/AGENTS.md`; follow those when working inside their directories.

