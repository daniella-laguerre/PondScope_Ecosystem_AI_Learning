# The Pondscope Metaphor Reference

Every landscape term used across the site, what it stands for, and — where it
matters — where it stops being true.

The whole system rests on one distinction. Read it first or nothing else lines
up:

> **The land forms. Then the pond is shaped. Then, and only then, water moves.**
>
> Pre-training makes the land. Post-training shapes the hollow.
> Both are finished before a single token arrives.
> The water is what you watch at runtime — and nothing you see moving
> changes the ground it moves through.

---

# Reverse index

For readers who meet a term mid-lesson and need it fast.

| If you read… | It means |
|---|---|
| the land | the base model's weights |
| sediment | the pre-training corpus |
| the pond | a fine-tune or adapter, and its live state |
| the water | the hidden state at runtime |
| a pebble | one token |
| the dials | the state's independent coordinates |
| the notebook | attention and its stored entries |
| the readers | attention heads |
| the surveyor | a reward model |
| the sea | a checkable, objective outcome |
| the leash | the KL penalty |
| the blueprint | supervised demonstrations |
| the grass | the tool/context protocol |
| the lake | an external document store |
| the inlet | retrieval |
| the watershed | graph structure over the sources |
| the region | a council of models |

---

# PART ONE — Pre-training: how the land formed

Nothing here is designed. Land accumulates.

| Landscape | Machine | Note |
|---|---|---|
| **Sediment** | the training corpus | deposited, not selected item by item |
| **Grain size** | tokenization | how finely the material is broken before it settles |
| **The kinds of grain that exist** | the vocabulary | a fixed, finite set of pieces |
| **Grains of like kind settling together** | embeddings | similar things end up near each other, by use not by decree |
| **Aeons of deposition and pressure** | pre-training compute | scale is time and weight, not cleverness |
| **The rock that results** | the weights | the shape the ground has, before anyone digs |
| **Bedrock type** | the architecture | decides which shapes are even possible above it |
| **Featureless ground before deposition** | random initialization | no structure yet, only a surface |
| **Settling toward the low places** | gradient descent | the ground finds its own minima under a force |
| **How fast the ground is allowed to settle** | learning rate | too fast and it fractures, too slow and nothing sets |
| **Ground moulded so exactly to one season's rain that the next season floods it** | overfitting | fits what fell, fails what falls next |
| **Braces and drainage that stop it setting too rigidly** | regularization | weight decay, dropout, early stopping |
| **Polluted sediment** | data contamination | benchmark answers already in the ground |
| **Land built from sediment eroded off other people's land** | model collapse / synthetic-data feedback | why everything starts to look the same |

**The pre-training claim in one line:** you do not build this land. You choose
what falls on it and how long you wait.

---

# PART TWO — Post-training: shaping the pond

Here there *is* a digger, and the questions become who judges the work and how
the judgment reaches the shovel.

## Digging — no judge

| Landscape | Machine |
|---|---|
| **A hollow dug in the land** | a fine-tune |
| **A hollow dug without disturbing the land under it** | an adapter / LoRA |
| **Digging to a handed-over blueprint** | SFT — copy the demonstrations |
| **Dig several, keep the best, leave the land alone** | best-of-N / rejection sampling |
| **Keeping the good ones as new blueprints and digging again** | STaR |

## Reshaping to a survey — a judge who has an opinion

| Landscape | Machine |
|---|---|
| **The surveyor** | the reward model |
| **Reshaping the banks toward what the surveyor scores well** | RLHF |
| **A pond that delights the surveyor and nobody wants to sit beside** | reward hacking / overoptimization |
| **The leash that stops the digger leaving the site** | the KL penalty |
| **The site as it was before this dig** | the reference model |
| **A survey conducted by another pond** | RLAIF |
| **Posted rules the surveyor must obey** | Constitutional AI |
| **Reshaping straight from the comparison notes, no surveyor hired** | DPO |
| **Not digging a canyon on a unanimous vote** | IPO |
| **Reshaping from lone reactions rather than side-by-side pairs** | KTO |
| **One note: this one over that one** | a preference pair |

**The fact this section exists to carry:** you are never shaping toward the
visitors. You are shaping toward a *model* of the visitors, built from a finite
survey, and it will faithfully reward its own mistakes.

## Checking against the sea — a judge with no opinion

| Landscape | Machine |
|---|---|
| **The sea** | a checkable outcome — test passes, proof holds, answer matches |
| **Does the water reach the sea?** | RLVR |
| **Only the sea is checked; the route is nobody's business** | outcome-only RL |
| **Inspecting the channel at every bend** | process reward model |
| **Two ponds shaping each other until the shoreline moves** | self-play |

**And its limit, stated whenever it is praised:** this only works where there
*is* a sea. Most of what a model says has no checkable outcome, which is why
these methods dominate maths and code and go quiet on essays and judgment.

---

# PART THREE — Runtime: the water

Not on either map above. This is what you watch move.

| Landscape | Machine |
|---|---|
| **The water** | the hidden state, live, during a sequence |
| **A pebble dropped in** | one token arriving |
| **Ripples spreading and fading** | the state evolving and decaying |
| **The pond's dials — one ripple size each** | the diagonal state coordinates |
| **How far the system flows between two looks** | Δ, the discretization step |
| **The reader on the bank with a notebook** | attention |
| **One entry per pebble, never rewritten** | the KV cache |
| **How many pages the reader may keep** | the context window |
| **Several readers, each with their own index of what is worth flipping back to** | multi-head attention |
| **A gatekeeper deciding whether to consult the water or the notebook** | the router (in a hybrid) |
| **Which pond you are sent to at all** | MoE routing |
| **Water taking the steepest path every time** | greedy decoding |
| **Letting the water wander instead of always taking the steepest path** | temperature / sampling |
| **Only letting it wander into the few most likely channels** | top-k / top-p |

**The line that must not blur:** the water never reshapes the bank. Nothing you
see at runtime changes a weight. When someone taps a symbol in the
visualization, no training of any kind is happening — a hollow that was already
shaped is doing what its shape makes it do.

---

# PART FOUR — The surroundings: everything outside the model

| Landscape | Machine |
|---|---|
| **The grass at the edge** | the protocol (MCP) — a way in, holding nothing |
| **A distant lake, larger than any pond** | the external corpus |
| **An inlet channelled from that lake** | retrieval (RAG) |
| **The watershed — the connected paths water arrives along** | graph-structured retrieval |
| **Silt that arrives and settles in the pond** | context injected into the prompt |
| **The region: several ponds, compared** | a model council / ensemble |
| **Standing where all the ponds agree, then deliberately walking elsewhere** | the anti-council / divergence search |

Two of these are frequently misfiled and shouldn't be:

- **The grass is not memory.** A protocol is a standard doorway, not a store.
- **The region asks a different question.** Everything else asks *what does this
  model know*; a council asks *whose answer do we trust*.

---

# PART FIVE — Where the metaphor breaks

A metaphor you can't puncture is a metaphor you'll over-trust. These are the
seams, and they belong in the published version.

**Depth has no landscape.** A real model is dozens of layers stacked, each with
its own state and attention. There is no natural picture of forty ponds in
series, and pretending otherwise is the single biggest simplification on the
whole site. What you see is *one layer*, honestly.

**The notebook is a different metaphor family.** Stationery, not geology. That
is deliberate — it is an object *carried to* the landscape, not part of it,
which is exactly right for a mechanism that stores a separate record instead of
blending everything into shared ground. But it is a seam, and worth admitting.

**Water is continuous; tokens are not.** The pond flows all the time in the
picture. The model is sampled once per token and is perfectly still between
them. The visualization handles this correctly by freezing between taps —
but the intuition water gives you is wrong here, and it needs saying.

**"Squeezed summary" flatters the pond.** Real fixed-state memory is lossy in
ways water isn't: it doesn't just fade with distance, it *interferes*, so two
similar facts can corrupt each other rather than simply grow faint.

**Erosion and corrosion were rejected on purpose.** They put the difference
between RLHF and RLVR in the *force*, when the force is identical — the same
algorithm, the same gradients. The difference is entirely in the *judge*. Any
metaphor that reaches for weathering has already lost the point.

**The land is not really immovable.** Continued pre-training, merges, and
further fine-tuning all change the base. The site treats the land as fixed
because *at runtime it is*, and that is the distinction worth protecting — but
over a model's life the ground does move.


---

*The landscape is exposition, not a result. Every mechanism named here is
standard and cited in the site's sources; the geography is only a way of
holding them in mind — and Part Five is there because a metaphor is only
trustworthy once you know where it fails.*
