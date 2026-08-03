# The Post-Training Map, in Pond Terms

Everything here happens **before anyone taps a token.** The water you watch move
in the visualization runs through a hollow whose shape was already settled by
the methods below. Keep that line clean and the whole map stays honest:

> **These shape the pond. They are not the water.**

The pond is the fixed-size state that carries information *while a sequence
runs*. Post-training is how the pond got its shape. Confusing the two is the
single most common way explainers of this material go wrong.

---

## The ground rules of the geography

| Landscape | Machine |
|---|---|
| The land | the base model after pretraining |
| A pond dug in it | a fine-tune or adapter — local reshape, land untouched |
| The water | the state that moves at inference time |
| The sea | a checkable outcome (test passes, answer correct) |
| A surveyor | a learned reward model standing in for human judgment |

---

## 1. Digging — supervised methods

### SFT (supervised fine-tuning)
**Digging to a handed-over blueprint.** Someone gives you the shape they want
and you dig to match it. No judgment is involved anywhere: copy the plan,
example by example. Every method below assumes this has already happened —
you cannot usefully reshape a hollow that doesn't exist yet.

*Limit:* you can only ever reach shapes someone has already drawn. The model
learns to imitate demonstrations, not to exceed them.

### Rejection sampling / best-of-N / STaR
**Dig several ponds, keep the best one, leave the land alone.** Generate many
candidate answers, filter to the good ones, and either just serve those (best-of-N,
a pure inference-time move that changes no weights) or feed the survivors back
in as new blueprints and re-dig (STaR, rejection-sampling fine-tuning).

*Why it earns its place:* it is the cheapest thing that works, and it is often
the honest baseline any fancier method has to beat.

---

## 2. Reshaping to a survey — preference methods

The common problem: you cannot ask the water whether the pond is good, and you
cannot stand there forever watching visitors. So you collect judgments and
reshape toward them. Everything in this section differs only in **who judges**
and **how the judgment reaches the shovel.**

### RLHF (reinforcement learning from human feedback)
**Reshaping to a survey, not to the visitors.** Show people pairs of ponds, ask
which they prefer, train a **surveyor** (reward model) on their answers, then
reshape the banks toward whatever the surveyor scores highly.

*The fact no weathering metaphor can carry:* you are not optimizing human
preference. You are optimizing **a model of** human preference. The surveyor
was trained on a finite sample and will faithfully reward its own mistakes.
Dig long enough and you get a pond that delights the surveyor and that nobody
wants to sit beside — that is reward hacking, and it is structural, not a bug.

*The leash:* training keeps a penalty for drifting too far from the original
shape (a KL term). Without it the digger finds a shape that scores brilliantly
and is not a pond at all.

### RLAIF (RL from AI feedback)
**The survey is conducted by another pond.** Identical machinery, but the
preference labels come from a model rather than people. Vastly cheaper, scales
without limit — and inherits whatever that model is wrong about. The surveyor's
survey now has a surveyor.

### Constitutional AI
**Written rules posted at the site that the surveyor must obey.** Rather than
labeling preferences one at a time, you write down principles, have a model
critique and revise its own answers against them, and train on the result.
The rules are inspectable, which is the point: you can read what shaped the
pond instead of inferring it from a pile of labels.

### DPO (direct preference optimization)
**Reshape straight from the comparison notes — skip hiring a surveyor.** The
insight is that you don't need a separate reward model and an RL loop; the
preference data can drive the weight update directly. Simpler, more stable,
much cheaper. This is what most open fine-tunes actually use.

### IPO (identity preference optimization)
**Don't dig a canyon on a unanimous vote.** DPO has a quiet failure: when every
judgment favors A over B, the objective keeps widening that gap without bound.
IPO caps how far any single comparison can move the ground, however lopsided
the vote.

### KTO (Kahneman–Tversky optimization)
**You don't need pairs, just reactions.** DPO and IPO need someone comparing two
ponds side by side, which is expensive to collect. KTO works from lone judgments
— *this one, good* / *this one, bad* — which is what ordinary usage already
produces. It also borrows a behavioral-economics finding: a bad pond is felt
more strongly than a good one is enjoyed, so complaints are weighted more
heavily than compliments, deliberately.

> **Honest note on DPO / IPO / KTO:** these are three answers to a real problem,
> not a progression where each fixes the last. DPO is far more widely deployed;
> whether IPO or KTO beats it depends heavily on dataset and setup, and the
> published comparisons do not settle cleanly.

---

## 3. Checking against the sea — verifiable methods

The common move: stop asking anyone's opinion. Dig an outlet, run the water,
and let the terrain answer. Ungameable, because you are not being *scored* —
you are being *checked*.

### RLVR (RL from verifiable rewards)
**Does the water reach the sea?** The reward is a fact: the test passes, the
proof checks, the answer matches. No surveyor, so no surveyor to fool.

*The limit, which must be stated whenever RLVR is praised:* this only works
where there **is** a sea. Maths, code, formal proof, structured extraction —
fine. Most of what a model says has no checkable outcome at all, which is
exactly why RLVR shines on some tasks and goes silent on essays, advice,
and judgment.

### Outcome-only RL
**Only the sea is checked.** Dig the channel however you like — a hundred bends,
a stretch that doubles back, a route no one would have sanctioned. Nobody
inspects it. Water arrives or it doesn't.

*Strength:* it doesn't impose your idea of how a channel should run, which is
where the surprising results come from — this is the setup behind the reasoning
models, where letting the model find its own route to a verified answer beat
teaching it the route.

*Two weaknesses, both about the silence in between:* **credit assignment** —
the water didn't arrive and you have no idea which bend was wrong, so one signal
smears across every decision; and **arriving by accident** — a channel that
reaches the sea through a leak in the terrain scores the same as a good one.
Right answer, incoherent reasoning.

### Process rewards (PRM)
**Inspect at every bend, not only at the mouth.** Fixes credit assignment
completely — you know exactly where it went wrong — at the cost of needing a
judge for each bend, which quietly reintroduces the surveyor you were trying
to escape. The trade is diagnosis versus freedom: process rewards constrain the
route to what a judge recognizes.

### Self-play / iterated methods
**Two ponds feeding each other until the shoreline moves.** The model generates,
judges or competes against a copy of itself, and trains on the outcome; repeat.
Powerful where there is a hard win condition. Where there isn't, the pair can
drift together into a shared consensus that neither questions — a failure mode
worth naming, since it is the same collapse that makes model outputs
homogeneous.

---

## 4. Where it does *not* go

Three things sit elsewhere on the map, and putting them here is the mistake to
avoid:

- **Adapters** are a *place* (a pond dug in the land), not a *method*. Any
  method above can be applied to one, without touching the land underneath.
- **RAG** is the inlet from a distant lake — it changes what flows in at
  runtime, not the shape of the ground.
- **A council** is a different question entirely: not *what shape should this
  pond be* but *whose answer do we trust*.

And the one to hold on to:

- **The water is not on this map at all.** Everything here is finished before
  the first token arrives. When you tap a symbol in the visualization and watch
  ripples move, none of these methods are running — you are watching a hollow
  that was already shaped, doing what its shape makes it do.

---

## The map in one table

| Method | Pond reading | Judge | Needs |
|---|---|---|---|
| SFT | dig to a blueprint | none | demonstrations |
| Best-of-N | dig several, keep one | a scorer | inference budget |
| RLHF | reshape to a survey | learned surveyor | preference pairs |
| RLAIF | survey run by another pond | a model | a judging model |
| Constitutional AI | posted rules the surveyor obeys | written principles | rules + critique loop |
| DPO | reshape from the notes directly | the notes | preference pairs |
| IPO | same, with a cap on any one vote | the notes | preference pairs |
| KTO | reshape from thumbs up/down | lone judgments | unpaired labels |
| RLVR | does the water reach the sea | the terrain | a checkable outcome |
| Outcome-only RL | only the sea is checked | the terrain | a checkable outcome |
| PRM | checked at every bend | a step judge | step-level labels |
| Self-play | two ponds shaping each other | a win condition | an opponent or copy |

---

## Sources

- **RLHF** — Christiano et al., "Deep Reinforcement Learning from Human
  Preferences," NeurIPS 2017, [arXiv:1706.03741](https://arxiv.org/abs/1706.03741);
  Ouyang et al., "Training Language Models to Follow Instructions with Human
  Feedback" (InstructGPT), 2022, [arXiv:2203.02155](https://arxiv.org/abs/2203.02155).
- **Reward hacking / overoptimization** — Gao, Schulman & Hilton, "Scaling Laws
  for Reward Model Overoptimization," 2022,
  [arXiv:2210.10760](https://arxiv.org/abs/2210.10760). The formal version of
  "delights the surveyor, nobody wants to sit beside it."
- **RLAIF** — Lee et al., 2023, [arXiv:2309.00267](https://arxiv.org/abs/2309.00267).
- **Constitutional AI** — Bai et al., 2022, [arXiv:2212.08073](https://arxiv.org/abs/2212.08073).
- **DPO** — Rafailov et al., NeurIPS 2023, [arXiv:2305.18290](https://arxiv.org/abs/2305.18290).
- **IPO** — Azar et al., "A General Theoretical Paradigm to Understand Learning
  from Human Preferences," 2023, [arXiv:2310.12036](https://arxiv.org/abs/2310.12036).
- **KTO** — Ethayarajh et al., "Model Alignment as Prospect Theoretic
  Optimization," 2024, [arXiv:2402.01306](https://arxiv.org/abs/2402.01306).
- **Process rewards** — Lightman et al., "Let's Verify Step by Step," 2023,
  [arXiv:2305.20050](https://arxiv.org/abs/2305.20050).
- **STaR** — Zelikman et al., 2022, [arXiv:2203.14465](https://arxiv.org/abs/2203.14465).
- **RLVR / outcome-only reasoning training** — DeepSeek-AI, "DeepSeek-R1:
  Incentivizing Reasoning Capability in LLMs via Reinforcement Learning," 2025,
  [arXiv:2501.12948](https://arxiv.org/abs/2501.12948).

*The pond framing is exposition, not a result. The methods and their trade-offs
are from the literature above; the landscape is a way of holding them in mind.*
