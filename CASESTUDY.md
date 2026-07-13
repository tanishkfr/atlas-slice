# Atlas — Stress Trace 01

> **Context:** Self-directed research-through-design
> **Year:** 2026
> **Role:** Independent designer, researcher, editor, and engineer
> **Status:** Working research instrument with a supporting single-authored corpus
> **Tools:** React, TypeScript, Vite, Framer Motion, Tailwind CSS
> **AI disclosure:** AI-assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, design decisions, editing, and authorship are by Tanishk Salagame.
> **Live:** https://atlas-slice.vercel.app/
> **Source:** https://github.com/tanishkfr/atlas-slice

## Proposition

**An interaction principle is only as useful as the distant cases it survives.**

Atlas asks whether design reasoning can be made inspectable without turning judgment into an answer generator.

## The shift

Atlas began as a library of completed answers to interaction-design questions. The writing was useful, but the visitor remained a reader of finished reasoning.

The project was reorganized around a participatory instrument: state a rule, expose it to pressure, revise it when necessary, and preserve the full lineage. The corpus now supports that interaction instead of acting as the project’s center.

## Instrument

The visitor writes a principle for one question: when should tapping outside a dialog close it?

Atlas then applies three authored pressures:

1. a near, low-consequence lightbox;
2. a distant, high-consequence financial transfer;
3. an orthogonal switch-access case in which “outside tap” is not an available event.

At each pressure, the visitor records whether the principle held, was refined, or fractured. A hold preserves the wording. A refinement or fracture requires a visible revision. Every version remains available in the completed trace.

Progress persists in the browser, and the completed trace can be copied or downloaded. The artifact’s output is durable enough to inspect after the interaction ends.

## Interaction language

The signature interaction is the revision lineage:

- the current wording travels across a pressure rail;
- changed language appears as a visible before-and-after diff;
- held, refined, and fractured states remain distinct;
- the first and final claims stay side by side;
- reset is deliberate rather than accidental.

Motion is reserved for movement in the reasoning: a case entering, a branch changing, or a trace drawing into view. Previously read content no longer blurs or recedes.

## Supporting corpus

The wider corpus contains 33 single-authored interaction-design arguments. Four recurring reasoning patterns organize it:

1. conditional branch;
2. misconception reversal;
3. rule inversion;
4. variable map.

These patterns are an editorial lens, not a validated taxonomy. The interface labels them directly and explains that repeated silhouettes communicate classification rather than independent measurement.

## Evidence boundary

W3C and Microsoft guidance anchor constraints in the three stress cases. They do not provide Atlas’s verdict.

The wider corpus includes product examples and empirical claims whose verification status is documented separately in [CITATION-AUDIT.md](CITATION-AUDIT.md). Until that audit is cleared and source links are attached, the corpus should be read as authored design argument—not as a verified evidence database.

## Accessibility and resilience

The interface provides:

- real hash routes for back, forward, reload, and direct links;
- persistent trace state;
- explicit focus movement after route and case changes;
- a skip link and semantic page headings;
- visible keyboard focus and minimum touch targets;
- reduced-motion behavior;
- readable text and control contrast;
- descriptive alternatives for the four reasoning patterns.

## Limits

The pressure cases are authored, not sampled, and their sequence is intentionally adversarial. Atlas has not been tested with learners, so it demonstrates a mechanism for practicing transfer without claiming that transferable judgment occurred.

Independent classification of the supporting corpus has not been conducted. The project contributes an authored interaction grammar and a working instrument, not a proven learning outcome or universal taxonomy.

## Contribution

Atlas contributes a compact grammar for principle revision:

**claim → pressure → hold, refine, or fracture → preserved lineage**

Its memorable object is a rule traveling across a trace and changing shape under pressure—not a library claiming to know the answer.
