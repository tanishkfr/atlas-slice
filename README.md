# Atlas

**Test a design rule against situations that may change it.**

Atlas is an interactive design project. You write a rule, try it in three very different examples, and see where it still works or needs to change.

Atlas does not grade the answer or generate a “correct” rule. It keeps the full history so the visitor can see how their own thinking changed.

## The main activity

1. Edit a suggested rule about when tapping outside a dialog should close it.
2. Try the rule in a similar example, a high-risk example, and an accessibility example.
3. Keep the wording if the rule still works, or rewrite it if it needs to change.
4. Review, copy, or download the result.

Progress is saved in the browser. Starting over rotates to a different suggested rule. Text areas grow with the answer but cannot be dragged or manually resized.

## The 33 design examples

The original 33 design questions and answers are still part of Atlas. They are available from the **33 examples** navigation link and from the main rule-test page.

The examples are grouped into four simple answer styles:

- Two paths
- Common belief, corrected
- Same rule, opposite answers
- Things to weigh

These groups help people browse the work. They are not presented as a proven system or as research evidence.

## Run locally

~~~sh
npm install
npm run dev
~~~

Verification:

~~~sh
npm run build
npm run lint
~~~

See [CASESTUDY.md](CASESTUDY.md) for the design argument and [CITATION-AUDIT.md](CITATION-AUDIT.md) for the unresolved evidence audit.

## Authorship

Independent design, research, writing, and engineering by Tanishk Salagame, 2026.

AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, editing, visual direction, implementation decisions, and authorship are by Tanishk Salagame.
