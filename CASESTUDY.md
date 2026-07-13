# Atlas — Rule Test 01

> **Context:** Self-directed research-through-design
> **Year:** 2026
> **Role:** Independent designer, researcher, editor, and engineer
> **Status:** Working rule-testing activity with 33 supporting design examples
> **Tools:** React, TypeScript, Vite, Framer Motion, Tailwind CSS
> **AI disclosure:** AI-assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, design decisions, editing, and authorship are by Tanishk Salagame.
> **Live:** https://atlas-slice.vercel.app/
> **Source:** https://github.com/tanishkfr/atlas-slice

## Proposition

**A design rule becomes useful when it still works in very different situations.**

Atlas asks whether design reasoning can be made inspectable without turning judgment into an answer generator.

## The shift

Atlas began as a library of completed answers to interaction-design questions. The writing was useful, but the visitor remained a reader of finished reasoning.

The project was reorganized around an interactive rule test: write a rule, try it in different situations, change it when needed, and keep the full history. The 33 design examples now support that activity instead of acting as the project’s center.

## Rule test

The visitor writes a rule for one question: when should tapping outside a dialog close it? A restart rotates to a different sentence starter while keeping the same question and its three matching examples.

Atlas then shows three examples:

1. a similar, low-risk lightbox;
2. a different, high-risk financial transfer;
3. an accessibility example in which “outside tap” is not an available event.

For each example, the visitor chooses whether the rule still works, needs a change, or breaks. Keeping the rule preserves its wording. Changing or breaking it requires a visible rewrite. Every version remains available in the final result.

Progress stays in the browser, and the completed result can be copied or downloaded. Text areas grow with the answer but cannot be manually resized.

## Interaction language

The signature interaction is the revision lineage:

- the current wording travels across a pressure rail;
- changed language appears as a visible before-and-after diff;
- held, refined, and fractured states remain distinct;
- the first and final claims stay side by side;
- reset is deliberate rather than accidental.

Motion is reserved for movement in the reasoning: a case entering, a branch changing, or a trace drawing into view. Previously read content no longer blurs or recedes.

## The 33 design examples

Atlas still includes all 33 single-authored interaction-design questions and answers. Four simple answer styles organize them:

1. Two paths;
2. Common belief, corrected;
3. Same rule, opposite answers;
4. Things to weigh.

These groups make the examples easier to browse. They are not a validated system, and the interface says so directly.

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
