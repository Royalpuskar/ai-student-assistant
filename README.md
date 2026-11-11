# StudyNest — Student Study Assistant

**A working, responsive student productivity website with transparent, deterministic study tools.** Part of the [Royalpuskar](https://github.com/Royalpuskar) portfolio.

The repository retains the original `ai-student-assistant` name, but this implementation does **not** call a live language model or pretend that heuristics are generative AI.

## What works

- **Study Planner:** choose subject, number of days (1–14), minutes per day (15–240); generate a timed daily learning schedule.
- **Notes Studio:** extract the first three sentences and recurring keywords from your pasted notes.
- **Study Helper:** a rules-based interactive helper for common study questions.
- Local browser execution, responsive UI and no keys or user accounts.
- An optional dependency-free Node.js API for `/chat`, `/api/plan`, `/api/notes`, and `/health`.

## Run the website

**Static mode (works on GitHub Pages):**

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. This serves `index.html` and loads `core.mjs` locally in the browser.

**Node server mode (also exposes HTTP endpoints):**

```sh
npm start
```

Requires Node.js 22 or newer, no `npm install` needed. Open `http://127.0.0.1:3000`. Change `HOST` and `PORT` environment values on approved hosting platforms.

## Test

```sh
npm test
```

The tests cover input validation, deterministic schedules, note extraction, static HTTP delivery, API response behavior and cross-origin rejection.

## Limitations and privacy

This is a **working prototype**, not a sophisticated LLM, essay-writing tool, or fact checker. Summaries are **extractive**, not semantically generated; study plans are generic rather than institution- or course-specific. Everything entered into the browser UI stays in the current page and is not uploaded. The optional Node API processes requests in memory and does not save messages.

Do not enter sensitive records into publicly hosted services without understanding their privacy practices. An authenticated, model-backed service would require a server-controlled secret, usage caps, user consent and additional safeguards.

## Architecture

- `index.html`, `style.css`, `app.mjs`: website
- `core.mjs`: pure deterministic study tools
- `backend/server.js`: optional HTTP server (no Express/CORS dependency)
- `core.test.mjs`, `server.test.mjs`: automated tests
- `.github/workflows/verify.yml`: GitHub Actions checks
