# Citation audit

Every empirical claim in the corpus, sorted by how urgently it needs a real,
linkable source before Atlas can be handed to a skeptical reader. Two citations
previously shipped **backwards**; at 33 entries, a single bad source materially
weakens the whole.

Rules for clearing an item:
- A claim that names a **study, statistic, or standard** needs a URL that a
  stranger can click and verify says what the entry says it says.
- Verify the **direction**, not just the existence, of each source. The
  dangerous failure is a real source that supports the *opposite* of the point.
- Product behaviours (Gmail, Figma, Slack…) are **illustrations, not evidence** —
  they don't need a citation, but the factual claim about them still has to be
  currently true.

Suggested source *leads* below are starting points only. **Do not paste a lead
into the corpus without opening it and confirming it first.**

---

## Priority 1 — vague or contested, presented as hard evidence

These are the ones a researcher will challenge first. Each either hides its
source behind "studies show…" or makes a claim that is genuinely disputed.

| Entry (`const`) | Claim as written | Problem | Action |
|---|---|---|---|
| `disabledButtonEntry` | "Stripe's own Elements integration guide has developers listen for real-time validation…" | This is the citation that shipped **backwards** once. | Re-open Stripe's current docs and confirm the direction *before* trusting the sentence. Lead: Stripe Elements / Payment Element validation docs. |
| `disabledButtonEntry` | "Nielsen Norman Group's own research on disabled buttons…" | Real, but uncited. | Add the exact NN/g article URL on disabled/greyed-out buttons. |
| `skeletonScreenEntry` | "Studies on perceived performance found sites using skeleton screens were perceived as roughly 30% faster" | "Studies on perceived performance" names nothing, and the 30% figure is **contested** — the empirical support for skeletons beating spinners is weaker than the sentence implies. | Name the specific source or soften the claim to what's actually defensible. |
| `skeletonScreenEntry` | "Nielsen Norman Group's own perceived-performance guidance puts a floor… below roughly 500 milliseconds" | Needs the exact NN/g source; verify the 500ms threshold is theirs. | Link NN/g response-times / loading guidance. |
| `carouselEntry` | "A widely cited study found roughly 1% of visitors clicked… 84% of those on the first slide" | "A widely cited study" is the classic unfalsifiable citation. | Name it. Lead: Erik Runyon (Notre Dame) carousel click data. |
| `carouselEntry` | "Adobe's own conversion test for a financial services client… 23% increase in sales" | Specific number, no source. | Find and link the source, or cut the exact figure. |
| `notificationPermissionEntry` | "Appjobs' own case study on notification opt-in…" | Uncited case study; hard for a reader to find. | Link the case study or attribute it more precisely. |
| `onboardingTutorialEntry` | "Self-triggered product tours see roughly double the completion rate…" | No source for "double." | Cite (lead: Appcues / Pendo product-tour benchmarks) or qualify. |
| `darkModeEntry` | "A controlled study on reading polarity found people read text faster and more accurately as dark-on-light" | Real finding, unnamed. | Name it. Lead: Piepenbrock et al. on display polarity / positive-polarity advantage. |
| `darkModeEntry` | "something like half of people have some degree of [astigmatism]" | Stat needs a source. | Add an ophthalmology/prevalence citation or soften to a defensible range. |

## Priority 2 — real and verifiable, just missing the link

These are almost certainly correct. They only need the exact URL attached so a
reader doesn't have to take them on faith.

| Entry (`const`) | Source named | Lead |
|---|---|---|
| `hamburgerMenuEntry` | "NN/g… 179 people, six real sites" | NN/g hidden-navigation study. |
| `formColumnsEntry` | "CXL Institute's… 702 people… 15 seconds faster" | CXL/Adobe form-layout study. |
| `optionalFieldEntry` | "Baymard Institute's… roughly 32%" | Baymard required/optional field research. |
| `errorColorEntry` | "WCAG's Use of Color criterion" + "1 in 12 men, 1 in 200 women" | WCAG 1.4.1; colour-vision-deficiency prevalence source. |
| `dragKeyboardEntry` | "WCAG's Dragging Movements criterion" | WCAG 2.5.7 (2.2). |
| `iconLabelEntry` | "NN/g's… icon-usability research" (heart/star) | NN/g icon usability article. |
| `smartDefaultEntry` | "GDPR now specifically requires these to default unchecked" | GDPR consent / Planet49 (C-673/17) ruling. |
| `settingsApplyEntry` | "NN/g's own toggle guidelines" | NN/g toggle-switch guidelines. |
| `darkModeEntry` | "iOS and macOS keep Increase Contrast… separate from Dark Mode" | Apple accessibility settings (verify current UI). |

## Priority 3 — product illustrations: check the fact, not the source

No citation required. But confirm each is still *true*, since product behaviour
drifts. One is already suspect:

- `deleteConfirmationEntry` — **"Figma stops you before deleting a file: there's
  no undo path once it's gone."** Figma has moved deleted files to a recoverable
  "Deleted" area on some plans. **Verify this is still accurate**, or the entry
  argues from a false premise.
- Spot-check the rest for current accuracy: Gmail/Slack undo-send, Instagram
  "New Posts" indicator, X (Twitter) per-type notification toggles, Google Docs
  no save button, Slack dot-vs-count mentions.

---

## Fastest path to credibility

1. Clear all of **Priority 1** — that's what turns "trust me" into "check it."
2. Attach links for **Priority 2** in one pass.
3. Fix the Figma claim in **Priority 3**, spot-check the others.
4. Consider adding an optional `source?: string` (URL) field to `EvidenceNote`
   in `entry.ts` and surfacing it as a small "source" link in each answer — that
   makes the whole "checkable evidence" promise literally clickable, which is
   the single strongest answer to the researcher critique.
