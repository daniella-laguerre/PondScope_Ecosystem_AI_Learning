# PondScope Ecosystem — AI Learning Tool

**Author:** Daniella M. LaGuerre · August 2026

Interactive lessons on machine memory: fixed-size **pond** state, growing **notebook** attention, and **multi-head** specialization — with an immersive **Astro** home that treats the pond as a playable digital twin.

**Live:** https://daniella-laguerre.github.io/PondScope_Ecosystem_AI_Learning/

---

## Path (read in order)

| # | Page | Idea |
|---|---|---|
| — | Home (Astro) | Interactive pond twin + Start Here / depth toggle / guided path |
| — | [education-context.html](src/pages/education-context.astro) | What models are, HF/Ollama, architectures, coding agents |
| 1 | [pond-continuous.html](public/pond-continuous.html) | Continuous SSM pond, sampled once per token |
| 2 | [pond-vs-attention.html](public/pond-vs-attention.html) | Pond vs notebook on the same recall task |
| 3 | [multi-head.html](public/multi-head.html) | Why attention needs many heads at once |
| 4 | [issues-lab.html](public/issues-lab.html) | Failures visualized on the systems from 01–03 |

Content pages (static, same URLs): [context](public/context.html) · [metaphor reference](public/metaphor-reference.html) · [glossary](public/glossary.html) · [feedback](public/feedback.html).

---

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/PondScope_Ecosystem_AI_Learning/
npm run build    # → dist/
npm run preview
```

GitHub Pages deploys via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) (Actions → Pages). In the repo **Settings → Pages**, set source to **GitHub Actions** (not “Deploy from a branch”).

---

## Architecture notes

- **Astro** builds the home experience (`src/pages/index.astro`) with Fraunces + Source Sans 3, Lenis smooth scroll, and a canvas pond twin (`src/scripts/pond-hero.ts`).
- **Labs stay self-contained HTML** under `public/` so deep links (`pond-continuous.html`, Issues Lab `?issue=…`) keep working.
- Plausible analytics remain in the Astro layout head.

---

## Related

Causal debugger (separate repo): [PondScope_AI_Debugger](https://github.com/daniella-laguerre/PondScope_AI_Debugger)
