# PondScope Ecosystem — AI Learning Tool

**Author:** Daniella M. LaGuerre · August 2026

Interactive HTML lessons on machine memory: fixed-size **pond** state, growing **notebook** attention, and **multi-head** specialization.

No install. Open [`index.html`](index.html) in a browser, or visit the GitHub Pages site after deploy.

---

## Path (read in order)

| # | Page | Idea |
|---|---|---|
| 1 | [pond-continuous.html](pond-continuous.html) | Continuous SSM pond, sampled once per token |
| 2 | [pond-vs-attention.html](pond-vs-attention.html) | Pond vs notebook on the same recall task |
| 3 | [multi-head.html](multi-head.html) | Why attention needs many heads at once |
| 4 | [issues-lab.html](issues-lab.html) | Failures **visualized on** the pond / notebook / multi-head systems from 01–03 — with **Reset** / **Reset all** |

Landing page: [index.html](index.html) — **interactive lessons** are primary; industry definitions sit beside them. Issues Lab is after; glossary deep links still work.

Post-training map: [post-training.html](post-training.html) (source: [post-training-map.md](post-training-map.md)) — SFT, RLHF, DPO, RLVR, and kin in pond terms. **These shape the pond; they are not the water.**

Context: [context.html](context.html) — origin of the pond metaphor (conversation with Claude) and how this site was built (Cursor · Grok 4.5), with the embedded PDF `assets/from-tan-to-the-pond.pdf`.

Glossary: [glossary.html](glossary.html) — AI / ML terms, including a **Post-training** section (SFT, RLHF, RLAIF, Constitutional AI, DPO, IPO, KTO, RLVR, PRM, …) and **Issues & failure modes** with **Try it** links (`#tokens`, `#latency`, `#grounding`).

Comments / feedback / questions: [feedback.html](feedback.html) — labs listed; **comments** are live on the page (Giscus / GitHub Discussions); **feedback** and **questions** open GitHub Issues.

---

## Local use

```bash
open index.html
# or
python3 -m http.server 8000
# then http://localhost:8000/
```

---

## Related

Causal debugger (separate repo): [PondScope_AI_Debugger](https://github.com/daniella-laguerre/PondScope_AI_Debugger)
