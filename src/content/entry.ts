export type EvidenceNote = {
  product: string
  text: string
}

export type BranchContent = {
  value: string
  choiceLabel: string
  leadIn: string
  reasoning: string
  evidence: EvidenceNote
  counterNote: string
}

export type DissolvingMove = {
  intro: string
  content: string
  evidence: EvidenceNote
  costNote: string
}

export type AtlasEntry = {
  kind: 'branch'
  query: string
  keywords: string[]
  reframe: string
  branchPrompt: string
  branches: [BranchContent, BranchContent]
  dissolvingMove: DissolvingMove
  principleBridge: string
  principle: string
  mechanics: string
}

export type MisconceptionEntry = {
  kind: 'misconception'
  query: string
  keywords: string[]
  /** The common belief, stated plainly enough to be predicted true/false. Not yet revealed as wrong. */
  mirrorClaim: string
  /** The fast, sharp correction: deliberately shorter and blunter than the explanation that follows. */
  contradiction: string
  /** Slows back down: the mechanism behind why the belief is wrong. */
  explanation: string
  evidence: EvidenceNote
  principle: string
}

export type RuleInversionEntry = {
  kind: 'rule-inversion'
  query: string
  keywords: string[]
  /** Agrees with the common rule first: refinement, not correction. Does not yet reveal the sharper question. */
  validation: string
  /** Case 1: a real example where the rule, applied plainly, is right. */
  confirmingCase: EvidenceNote
  /** Case 2: the same rule, applied just as faithfully, pointing the other way. */
  contradictingCase: EvidenceNote
  /** The question the tension between the two cases resolves into. */
  sharperQuestion: string
  explanation: string
  principle: string
}

export type Variable = {
  /** Short, addressable name for this variable: the unit the reader accumulates. */
  label: string
  text: string
}

export type MultiVariableEntry = {
  kind: 'multi-variable'
  query: string
  keywords: string[]
  /** Sets the "no single answer" expectation immediately, not as a late admission. */
  reframe: string
  /** 3 to 4 max per INTERACTION-LANGUAGE.md. No natural stopping point beyond that. */
  variables: Variable[]
  /** Bridges into the closing map: the moment the set becomes a single held structure. */
  mapIntro: string
  /** The map itself: names the variables again in compressed form, not a directive. */
  principle: string
}

export type Entry =
  | AtlasEntry
  | MisconceptionEntry
  | RuleInversionEntry
  | MultiVariableEntry

export const deleteConfirmationEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should I confirm before deleting a file?',
  keywords: ['delete', 'deleting', 'confirm before deleting', 'remove', 'trash', 'undo'],
  reframe:
    "That's a common place to start. The real question is: how bad is it if you're wrong?",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'frequent',
      choiceLabel: 'This happens constantly',
      leadIn: "Then I'd let it happen and give people a way back.",
      reasoning:
        "Interrupting every single time trains people to stop reading the warning. The one time it actually mattered, they've already stopped paying attention. An undo only protects anyone if it's impossible to miss for the few seconds it matters.",
      evidence: {
        product: 'Gmail and Slack',
        text: "don't ask first: they just hand you a few seconds to take it back.",
      },
      counterNote:
        'Confirming first would still work here. It would just cost you a warning nobody reads anymore.',
    },
    {
      value: 'rare',
      choiceLabel: "This is rare, and there's no path back",
      leadIn: "Then I'd stop them before it happens.",
      reasoning:
        "When something can't come back, the interruption isn't friction, it's the only chance anyone gets to catch their own mistake. It only stays effective if it stays rare: the moment a confirm dialog shows up on routine actions too, people stop reading it.",
      evidence: {
        product: 'Figma',
        text: "stops you before deleting a file: there's no undo path once it's gone.",
      },
      counterNote:
        "An undo toast would be faster. It would just mean betting everyone notices it in time, a bad bet once there's nothing left to notice.",
    },
  ],
  dissolvingMove: {
    intro: "There's a third move, and it's usually the better one if you can afford it.",
    content:
      "Don't make the action destructive in the first place. Move it to a trash instead of deleting it outright, and the whole question disappears: nothing was actually at risk yet.",
    evidence: {
      product: 'Google Drive',
      text: 'does this by default: the genuinely irreversible action, emptying the trash, is the one that finally gets the harder confirmation.',
    },
    costNote:
      "It's also the most expensive option: someone has to build and maintain the retention policy this depends on.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    'The cost of being wrong should decide whether you interrupt to prevent it, not the destructiveness of the action alone.',
  mechanics:
    'The undo-toast version works because of a commit-then-recover state. The delete happens optimistically, a reversal window stays open, and only after it closes does the action become final. Same mechanic under Gmail\'s "Undo Send."',
}

export const disabledButtonEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Should I disable this button until the form is valid?',
  keywords: ['disable', 'disabled', 'disabled button', 'greyed', 'grayed', 'inactive'],
  mirrorClaim: 'Disabling the button until the form is valid prevents errors.',
  contradiction: "It prevents a click. It doesn't prevent the confusion.",
  explanation:
    "A disabled button blocks a bad submission, but blocking isn't the same as explaining. Someone staring at a greyed-out button with no visible reason can't tell \"you're missing a field\" from \"the app is broken.\" The error was prevented, but so was the understanding. Nielsen Norman Group's own research on disabled buttons makes the same point from the usability side: disabling by default, with no communicated reason, is consistently worse than keeping the control live and pointing directly at what's wrong. The fix was never disable versus enable. It's whether the reason stays visible, continuously, regardless of which state the button happens to be in.",
  evidence: {
    product: "Stripe's own Elements integration guide",
    text: 'has developers listen for real-time validation events on each field and surface the error the moment it happens, independent of whatever the submit button is doing.',
  },
  principle:
    "A disabled button prevents a click. It doesn't explain one. The reason needs to be visible on its own, whether or not the button also happens to be inert.",
}

export const infiniteScrollEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should I use infinite scrolling for this list?',
  keywords: ['infinite scroll', 'scroll', 'pagination', 'paginate', 'load more', 'endless scroll'],
  reframe:
    "That's a common place to start. The real question is: does this task have a destination, or is it a wander with no particular end?",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'browsing',
      choiceLabel: "People are just browsing, no destination",
      leadIn: "Then let it flow. Infinite scroll is the right call.",
      reasoning:
        "The moment you stop someone to ask which page they want, you've reminded them this is a task instead of a wander, and wandering without a stopping point is the entire appeal. There's no \"place\" to protect, so nothing is lost by not having one.",
      evidence: {
        product: 'Instagram and TikTok',
        text: 'never paginate their main feeds. There is no footer, because there is no destination to reach.',
      },
      counterNote:
        "Pagination would still technically work. It would just interrupt a mode that was never trying to get anywhere in particular.",
    },
    {
      value: 'finding',
      choiceLabel: "They're looking for something specific",
      leadIn: "Then don't let the list disappear behind them. Keep a real place to return to.",
      reasoning:
        "The moment someone can't get back to result #7, you've broken the one thing this kind of task actually needed. Infinite scroll optimizes for momentum, but a search or comparison task needs orientation more than it needs momentum.",
      evidence: {
        product: 'Google Search',
        text: 'paginates its results, so you always know how many exist and can return to exactly where you left off.',
      },
      counterNote:
        "Infinite scroll would still feel smoother to use. It would just cost the one thing this kind of task actually needs: a place to come back to.",
    },
  ],
  dissolvingMove: {
    intro: "There's a third move that splits the difference, and it's the most common answer in practice.",
    content:
      "Load continuously, but keep a real, addressable position as you go: a \"load more\" pattern with an actual anchor in the URL or state, not true infinite scroll. You get the momentum without losing the return path entirely.",
    evidence: {
      product: 'Most e-commerce category pages',
      text: 'use a "load more" button rather than either full pagination or silent infinite scroll: momentum on demand, with a stopping point still intact.',
    },
    costNote:
      "It's a compromise, not a solution. It still asks the user to notice and click something, which pure infinite scroll never does.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    "Match the scroll pattern to whether the task has a destination. Infinite scroll fits a task with none, and quietly breaks the one that has one.",
  mechanics:
    "Infinite scroll works by appending content and discarding the concept of position; pagination works by keeping position as the primary unit of state. \"Load more\" is the two working side by side: appended content, retained position.",
}

export const notificationPermissionEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'When should I ask for notification permission?',
  keywords: ['notification permission', 'push permission', 'opt-in', 'ask permission'],
  validation:
    "Timing clearly matters here, and waiting usually beats asking the moment someone opens the app.",
  confirmingCase: {
    product: "Appjobs' own case study",
    text: "on notification opt-in found moving the permission ask away from onboarding entirely, waiting instead for the first moment someone was likely to see real value in it, raised opt-in measurably once the ask stopped competing with an install screen nobody had context for yet.",
  },
  contradictingCase: {
    product: "The common \"wait a few days\" pattern",
    text: "many teams implement \"don't ask immediately\" as a fixed delay, five or fifteen days after install, with no actual trigger behind it. It technically obeys the same rule, and it doesn't perform like the version tied to a real action, because counting days was never the mechanism that made waiting work in the first place.",
  },
  sharperQuestion:
    "The same instruction, \"wait,\" gets followed two different ways. What actually decides it: has something just happened that explains the ask, or has a clock simply run out?",
  explanation:
    "A calendar delay and a triggered prompt can land on the exact same day and feel completely different, because only one of them has a reason standing next to it. The rule was never really about time elapsed. Waiting only worked in the cases where it happened to mean waiting for something specific.",
  principle:
    "The right moment to ask isn't a time, it's a reason. If you can't point to what just happened that explains the ask, it's too early no matter the timestamp.",
}

export const modalEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should I use a modal here?',
  keywords: ['modal', 'dialog', 'popup', 'pop-up', 'overlay', 'lightbox'],
  reframe:
    "That's a common place to start. The real question is: does this need the person's full attention, or just a glance while they keep working?",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'full-attention',
      choiceLabel: 'They need to focus on only this before continuing',
      leadIn: "Then a modal is right. Blocking everything else is exactly the point.",
      reasoning:
        "Some moments are worse handled with partial attention than with an interruption, like a destructive confirmation or a blocking error. A modal spends the user's full attention on purpose, because a half-attended version of this decision is worse than stopping them entirely.",
      evidence: {
        product: 'Any destructive confirmation dialog',
        text: 'blocks the entire interface deliberately. A distracted "yes" here is the exact failure mode being designed against.',
      },
      counterNote:
        "An inline warning would still get noticed sometimes. It would just make it possible to miss the one moment where missing it matters most.",
    },
    {
      value: 'partial-attention',
      choiceLabel: "They'd want to see what's behind it while using this",
      leadIn: "Then skip the modal. An inline panel or popover keeps the context that's actually needed.",
      reasoning:
        "A modal removes exactly the thing someone came to reference: the canvas, the document, the list behind it. If the task is naturally done while glancing back and forth, a modal is solving a problem that didn't exist by creating one that does.",
      evidence: {
        product: "Figma's color picker",
        text: 'stays inline as a non-blocking panel, because choosing a color while unable to see the canvas defeats the purpose of choosing it.',
      },
      counterNote:
        'A modal would still get the job done. It would just remove the one thing the task actually depended on: visual context.',
    },
  ],
  dissolvingMove: {
    intro: "There's a third move for the cases sitting between the two.",
    content:
      "Use a non-modal overlay that's dismissible by clicking elsewhere: enough presence to get attention, without removing access to what's behind it. It's the right move for anything that deserves notice but not total focus.",
    evidence: {
      product: 'Most dropdown menus and lightweight popovers',
      text: 'work exactly this way: visible and focused, but one click away from returning to whatever was behind them.',
    },
    costNote:
      "It's easy to dismiss by accident, which is exactly wrong for anything that actually needed to be seen and acted on.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    "A modal should cost exactly as much attention as the task actually needs. If someone would reasonably want to see what's behind it, it doesn't belong in front of everything.",
  mechanics:
    "A true modal traps focus and blocks the rest of the interface at the input level, not just visually. Keyboard tab order, screen reader focus, and click targets all stop at its boundary. A popover does none of that; it's visual proximity without an attention lock.",
}

export const darkModeEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Is dark mode more accessible?',
  keywords: ['dark mode', 'light mode', 'contrast', 'color scheme'],
  mirrorClaim: 'Dark mode is easier on the eyes, for everyone.',
  contradiction: "For a real share of your users, it's backwards.",
  explanation:
    "Dark mode's high contrast, bright text on a dark field, causes a real optical effect called halation for people with astigmatism: light scatters inside the eye and text gets a fuzzy halo around it. Astigmatism isn't rare; something like half of people have some degree of it, and it's the moderate-to-high end where halation actually shows up. A controlled study on reading polarity found people read text faster and more accurately as dark-on-light than light-on-dark, across font sizes. None of that makes dark mode bad: for people sensitive to bright light or prone to eye strain and migraines, it's genuinely better. It means \"accessible\" was never one thing being measured. It's several different needs, and some of them pull in opposite directions.",
  evidence: {
    product: 'iOS and macOS',
    text: 'keep "Increase Contrast" as a setting entirely separate from Dark Mode. You can run both together, or neither. That\'s not an accident: contrast and color scheme are two different problems with two different fixes, and a platform that\'s actually thought about accessibility doesn\'t collapse them into one switch.',
  },
  principle:
    'Dark mode is a preference. Contrast is the accessibility feature. Wiring them to the same switch serves neither the person who wants a darker screen and the person who needs sharper contrast.',
}

export const clickCountEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Should I minimize the number of clicks it takes to complete a task?',
  keywords: ['clicks', 'steps', 'minimize', 'fewer steps', 'friction', 'wizard', 'multi-step'],
  validation:
    "That's the version most teams have heard, and it's true often enough to be dangerous.",
  confirmingCase: {
    product: 'Amazon',
    text: "built one-click checkout on exactly this: a repeat decision with nothing left to weigh, so collapsing it to one step removes a pause that was never actually happening anyway.",
  },
  contradictingCase: {
    product: 'TurboTax',
    text: "does the opposite, on purpose. Filing taxes is genuinely complex and high-stakes, so it's broken into a long sequence of single-question screens instead of a shorter, denser form. More steps, and also easier.",
  },
  sharperQuestion:
    "Same rule, pointed two different ways. The question that actually decides it: does each click take real thought, or is the answer obvious the moment you see it?",
  explanation:
    "Click-counting treats every click as identical, but a single click that requires reading a dense form and weighing six unclear options makes someone stop, while three clicks that each ask one obvious question don't. The total went down. The number of times someone actually paused went up.",
  principle:
    "It's not the number of steps that slows someone down, it's how many of them make someone stop and think. Five steps nobody pauses on move faster than one that stalls everyone.",
}

export const adaptiveUiEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should the interface adapt to usage, or stay the same for everyone every time?',
  keywords: ['adapt', 'adaptive', 'personalize', 'personalization', 'stay the same', 'consistent interface'],
  reframe:
    "That's a fair place to start, but this one doesn't collapse into a single rule. There are a few specific things that decide it, and once you know them, you can answer this yourself for a case Atlas never wrote about.",
  variables: [
    {
      label: 'How often they come back',
      text: 'A daily-habit tool rewards muscle memory: someone who opens it ten times a day needs the same things in the same place, every time. A tool used occasionally rewards relevance more than memorized location, since there was never any muscle memory to protect in the first place.',
    },
    {
      label: 'What a surprise actually costs here',
      text: "A thermostat's entire value is predictability, nobody wants their thermostat to surprise them. A feed's entire value is discovery: Spotify's homepage adapts constantly, and that adaptation is the product, not a risk to it.",
    },
    {
      label: 'Whether the change explains itself',
      text: "Gmail's shifting \"important\" sort is the case people actually resent, not because adapting is wrong, but because the system changed what they'd see without ever showing its work. An adaptive system needs to be visible enough to explain, or it just reads as broken.",
    },
  ],
  mapIntro: "None of these three settle it alone. Together, they do.",
  principle:
    "How often someone returns. What a surprise costs. Whether the change explains itself. Hold those three together, and you can answer this for a case Atlas never covered: no fourth rule required.",
}

export const accountWallEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should I require an account before someone can use the core feature?',
  keywords: ['account', 'sign up', 'signup', 'login', 'log in', 'require an account', 'anonymous', 'sign-up wall'],
  reframe:
    "Worth asking, but this isn't a single-rule question. A few specific things decide it, and naming them lets you work out cases Atlas never got to.",
  variables: [
    {
      label: 'Whether there is anything to show yet',
      text: "Tools like TinyWow let you drop a file in and get a working result in seconds, with no account anywhere in the flow, because the value exists the moment you land on the page. 1Password can't do that: there's nothing to demonstrate until something is actually being stored in a vault, so the account isn't gating the experience, it's a precondition for there being one.",
    },
    {
      label: 'What the account is actually protecting',
      text: "Some sign-up walls exist to prove someone is real before they can burn server time, send email, or call a paid API through your account. That reason has nothing to do with whether the feature itself needs to remember anything; it's abuse prevention wearing an account form.",
    },
    {
      label: 'How people actually arrive',
      text: "A tool that spreads by shared links, a document, a design file, a form, loses that entire loop the moment the first click hits a wall. A tool people already searched for and decided to evaluate pays a much smaller price for the exact same wall, because they arrived already committed.",
    },
  ],
  mapIntro: "No single one of these decides it by itself. Together, they do.",
  principle:
    "Whether there's something to show yet. What the account is really protecting. How people actually arrived. Hold those three together, and a case like this stops needing a rule Atlas never wrote down.",
}

export const hamburgerMenuEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Should I hide navigation behind a hamburger menu to save space?',
  keywords: ['hamburger', 'hamburger menu', 'hidden navigation', 'nav menu', 'navigation menu'],
  mirrorClaim: 'Hiding navigation behind a hamburger icon saves space without costing engagement.',
  contradiction: 'It saves space. It also cuts how often people find what\'s in there almost in half.',
  explanation:
    "Nielsen Norman Group ran this directly: 179 people, six real sites, phones and desktops both. Hidden navigation got used far less often than visible or partially-visible navigation on the same screen, and task time and difficulty both got worse along with it. The icon itself isn't the problem; most people recognize it by now. The problem is that anything tucked behind it stops competing for attention the moment it's out of sight, and out of sight is exactly where a hamburger puts it.",
  evidence: {
    product: "Nielsen Norman Group's own navigation study",
    text: 'found people used visible or combo navigation roughly twice as often as fully hidden navigation on desktop, and about 1.5 times as often on mobile, with worse task time and success in both cases.',
  },
  principle:
    "A hamburger menu doesn't hide clutter. It hides whatever's inside it, at the same rate, regardless of how important that thing actually is.",
}

export const skeletonScreenEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Should I show a skeleton screen instead of a spinner while content loads?',
  keywords: ['skeleton screen', 'spinner', 'loading', 'loading state', 'loading indicator'],
  validation:
    "Skeleton screens really do make a wait feel shorter, and there's real research behind that, not just a design trend.",
  confirmingCase: {
    product: 'Studies on perceived performance',
    text: 'found sites using skeleton screens were perceived as roughly 30% faster than identical sites using a spinner, same actual load time either way. Facebook, LinkedIn, and YouTube all adopted the pattern for exactly this reason: the brain starts reading the coming layout before any content has arrived.',
  },
  contradictingCase: {
    product: "Nielsen Norman Group's own perceived-performance guidance",
    text: 'puts a floor under that benefit: below roughly 500 milliseconds, a skeleton screen underperforms empty space, because the placeholder flashes on screen just long enough to become its own interruption, then gets swapped for content that was arriving anyway.',
  },
  sharperQuestion:
    "Same pattern, same intention, opposite result. What decides it isn't whether people prefer a skeleton to a spinner in general. It's how long the wait actually is.",
  explanation:
    "A skeleton screen works by giving a wait some shape to look at instead of nothing. Below a real threshold, there's no wait left to give shape to, so the shape becomes the only thing that flashed on screen.",
  principle:
    "A skeleton screen doesn't shorten a wait. It gives a real wait something to look like. Below the point where a wait exists at all, that isn't a shorter version of the same trick. It's the trick with nothing left to do.",
}

export const notificationBadgeEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should I show an exact unread count, or just a dot?',
  keywords: ['badge', 'unread count', 'notification dot', 'unread indicator', 'notification badge', 'unread badge'],
  reframe:
    "Reasonable place to start. The sharper fork underneath it: does the number change what someone does next, or only how they feel looking at it?",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'count-matters',
      choiceLabel: 'Someone would actually act differently at 3 versus 30',
      leadIn: "Then show the number. It's carrying real information.",
      reasoning:
        "An inbox is a queue you're expected to work through, and how much is left changes whether you open it now or put it off. Hiding that number wouldn't reduce the work waiting behind it, it would just remove the one piece of information that lets someone plan around it.",
      evidence: {
        product: 'Gmail and most email clients',
        text: 'show an exact unread count for exactly this reason: the number is the thing being decided around, not incidental to it.',
      },
      counterNote:
        "A dot would still tell you something arrived. It just wouldn't tell you whether that's a two-minute problem or a two-hour one.",
    },
    {
      value: 'presence-matters',
      choiceLabel: "Nobody's going to count them anyway",
      leadIn: 'Then a dot is enough. The number was never going to be used.',
      reasoning:
        "A feed doesn't have a queue to clear. There's no meaningful difference between 4 new posts and 40 the moment you open it, since nobody reads a feed in order or checks it off item by item. A count here doesn't inform anything; it just manufactures a small, specific pressure to make it go away.",
      evidence: {
        product: "Instagram's own \"New Posts\" indicator",
        text: 'was introduced specifically without a running number, to signal that something new arrived without pressuring anyone with exactly how much.',
      },
      counterNote:
        'A count would still be technically accurate. It would just be answering a question nobody watching that icon was actually asking.',
    },
  ],
  dissolvingMove: {
    intro: "There's a third case worth naming, because one real product handles it both ways.",
    content:
      'Slack shows a plain dot for general unread activity in a channel, and a number specifically when someone has been mentioned by name. Same app, same icon shape, different rule depending on whether the update is addressed to that person or just happening near them.',
    evidence: {
      product: 'Slack',
      text: 'treats a mention and a passing message as different categories of interruption, and lets the badge say which one this is before the channel is even opened.',
    },
    costNote:
      "It only works if the two categories are genuinely distinct to the person using it. Splitting a badge into two meanings that aren't actually different just adds a rule nobody asked for.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    "Show the number only when the number is what someone's deciding with. Otherwise a dot says everything that needed saying: something's here.",
  mechanics:
    'A count badge is bound to how many things are waiting; a dot badge is bound to whether anything is waiting at all. The dot pattern deliberately discards information the count pattern keeps: one tracks a depth, the other tracks a single yes or no.',
}

export const liveSearchEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should search results update as I type, or wait for me to submit?',
  keywords: ['search as you type', 'live search', 'instant search', 'typeahead', 'autocomplete', 'search button'],
  reframe:
    "Fair question, and the honest answer has more than one moving part. Name the parts, and you can work this out for a case Atlas never touched.",
  variables: [
    {
      label: 'What each result actually costs to produce',
      text: "Filtering a list already sitting in the browser costs nothing extra per keystroke, so there's no reason not to update live. A query that hits a paid API or a heavy database join costs something real every time it fires, and firing it on every keystroke multiplies that cost by however many letters someone types.",
    },
    {
      label: 'Whether a partial answer means anything',
      text: "Three typed letters already narrow a product catalog or suggest a username, because the space of plausible matches shrinks fast. A date range or a multi-field filter combination doesn't mean anything until every part of it is filled in, so showing results after each keystroke would just be showing noise with a timestamp on it.",
    },
    {
      label: 'Whether the shifting itself is the problem',
      text: "A dropdown of suggestions is expected to change while you type; that's the whole interaction. A results page changing under someone mid-read, while they're actually comparing rows against each other, breaks the one thing that page was for.",
    },
  ],
  mapIntro: 'Each one only tells part of it. Put together, they answer it.',
  principle:
    "What each result costs to produce. Whether a partial answer means anything yet. Whether the shifting itself gets in the way. Put those three side by side, and a case like this answers itself without any rule Atlas would have had to write down first.",
}

export const placeholderLabelEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Should I use placeholder text as the field label to save space?',
  keywords: ['placeholder', 'placeholder text', 'field label', 'form label', 'floating label'],
  mirrorClaim: "Placeholder text can stand in for a field's label without losing anything.",
  contradiction: "It saves a line of space. It also erases the label the moment anyone starts typing.",
  explanation:
    "Nielsen Norman Group's own testing found a specific, repeatable failure: someone fills a field, moves to the next one, and then can't recall what the first field was actually asking for, because the only label it ever had disappeared the moment they typed into it. Placeholder text also renders in low-contrast grey by default, a separate problem for anyone with low vision, and a third problem for anyone trying to recheck an error afterward: the reminder of what was expected is already gone by the time something needs fixing.",
  evidence: {
    product: "Nielsen Norman Group's own form-usability research",
    text: 'found that forms with a persistent, visible label outside the field consistently outperformed placeholder-only forms in testing, specifically because the label never disappears.',
  },
  principle:
    "The label's real job is being there when someone needs to double check what they typed. A placeholder does that job right up until typing starts, then stops, which is exactly the moment the job actually begins.",
}

export const formColumnsEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Should form fields be in one column, or grouped side by side?',
  keywords: ['form fields', 'single column form', 'multi-column form', 'form layout', 'side by side fields'],
  validation:
    "Single column really does complete faster, and there's real controlled data behind that, not just a style preference.",
  confirmingCase: {
    product: "CXL Institute's own controlled study",
    text: 'tested 702 people across a single-column and a multi-column version of the same form and found the single-column version completed about 15 seconds faster, a real, statistically significant gap, not noise.',
  },
  contradictingCase: {
    product: 'City, state, and zip, grouped as one row',
    text: "is the standard exception nearly every design system makes anyway, because the three fields read as one answer, not three separate questions. Splitting them across three separate full-width rows doesn't make the form clearer; it just makes one idea take three times as long to fill in.",
  },
  sharperQuestion:
    "Same instruction, and the exception isn't really about saving space at all. It's about whether the fields sitting next to each other are one answer or several.",
  explanation:
    "The single-column data holds for fields that are genuinely sequential, separate questions someone answers one at a time. It was never measuring what happens when three short fields are actually one address, which is why the exception isn't really an exception: it's the same rule, correctly applied to something that was never several questions to begin with.",
  principle:
    "Single column wins when each field is its own question. Group fields only when several boxes are really answering one question together, and nowhere else.",
}

export const errorColorEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Is marking an error field in red enough?',
  keywords: ['error color', 'red error', 'error indication', 'color blind', 'colorblind', 'error field'],
  mirrorClaim: "Marking an invalid field in red clearly tells everyone something's wrong.",
  contradiction: "It tells everyone who can see red as different from the field next to it. That's not everyone.",
  explanation:
    "This is a named accessibility requirement, not a stylistic suggestion: WCAG's Use of Color criterion exists specifically because color-only signals fail for a measurable share of real users. Something like 1 in 12 men and 1 in 200 women have a color vision deficiency that can make red-only error styling indistinguishable from the field beside it. The fix costs almost nothing: an icon, a written message, a border shape change, anything that survives if the color itself doesn't land. Color can still be part of the signal. It just can't be the only part of it.",
  evidence: {
    product: "WCAG's own published Use of Color criterion",
    text: "names \"error shown in red\" directly as a failing pattern when color is the only indicator, and requires a second, non-color signal alongside it.",
  },
  principle:
    "An error field needs at least two ways to be seen as wrong: one that works for color vision, and one that doesn't depend on it at all. Red alone gives exactly one.",
}

export const tooltipTriggerEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should a tooltip appear on hover, or require a click or tap?',
  keywords: ['tooltip', 'tooltips', 'hover', 'tap to reveal', 'info icon'],
  reframe:
    "Genuinely more than one thing decides this, and none of them is really \"hover versus click\" on its own.",
  variables: [
    {
      label: 'Whether hovering is even possible',
      text: "Hover doesn't exist as a concept on a touchscreen. A tooltip that only responds to a mouse simply never appears for anyone on a phone or tablet, which makes hover a desktop-only answer no matter how well it's built.",
    },
    {
      label: 'Whether a keyboard user can reach it at all',
      text: "Someone tabbing through a page without a mouse needs the tooltip to appear on focus, not on hover, or the information it holds effectively doesn't exist for them. This isn't a nice-to-have layered on top of hover; it's a separate trigger that has to work regardless of what hover does.",
    },
    {
      label: 'Whether the content is optional or actually needed',
      text: "A tooltip explaining a decorative icon can afford to be missed by someone who never hovers over it. A tooltip explaining what a required field actually wants, or why a submit button is disabled, can't be information that only appears for people who happen to move a mouse over the right pixel.",
    },
  ],
  mapIntro: "None of the three is optional to check. Skip one, and the tooltip works for fewer people than it should.",
  principle:
    "Whether hover exists at all. Whether a keyboard can reach it. Whether the content is load-bearing or decorative. A tooltip built around only the first one works on exactly one input method, for exactly the people who need the information least.",
}

export const progressIndicatorEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should I show a determinate progress bar, or just indicate that something is happening?',
  keywords: ['progress bar', 'determinate', 'indeterminate', 'progress indicator', 'percentage complete'],
  reframe:
    "Fair enough, though what actually decides it is whether the system can measure what's left, or whether it's simply working without a number to report.",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'measurable',
      choiceLabel: 'The system can genuinely estimate how much is left',
      leadIn: 'Then show the number. Withholding a measurable answer just manufactures uncertainty that never needed to exist.',
      reasoning:
        "A file upload knows its own size and current transfer rate. A multi-step import knows how many records are left. When the system already has the number, hiding it behind a generic spinner throws away the one thing that would have actually reduced anxiety: a real sense of when this ends.",
      evidence: {
        product: 'Any file upload progress bar',
        text: 'shows a percentage precisely because the browser already knows the file size and bytes transferred: the information exists, so there is no reason to withhold it.',
      },
      counterNote:
        "A spinner would still communicate that something is happening. It would just throw away an answer that was already sitting there for free.",
    },
    {
      value: 'unmeasurable',
      choiceLabel: "There's genuinely no way to estimate it",
      leadIn: "Then don't fake one. An indeterminate indicator is the honest version.",
      reasoning:
        "A search against a system whose response time varies wildly, or a call to a third-party service outside your control, doesn't have a real percentage to show. A progress bar that guesses is worse than one that doesn't pretend, because a bar that stalls at 90% for ten seconds erodes more trust than an animation that never claimed to know in the first place.",
      evidence: {
        product: 'Most AI image or text generation tools',
        text: 'use an indeterminate animation rather than a fabricated percentage, because the actual generation time varies too much to promise a number that might be wrong.',
      },
      counterNote:
        'A percentage would still feel more reassuring in the moment. It would just be a reassurance built on a number nobody can actually stand behind.',
    },
  ],
  dissolvingMove: {
    intro: "There's a third move for the case sitting in between: not knowing yet, but finding out fast.",
    content:
      'Start indeterminate, and switch to determinate the moment the system has enough information to estimate. The uncertainty is honest while it lasts, and it doesn\'t last the whole way through.',
    evidence: {
      product: 'Large file transfers and installers',
      text: 'commonly open with a brief spinner while calculating size and speed, then switch to a real percentage once there is something real to report.',
    },
    costNote:
      "It's two states to build and test instead of one, and the switch itself needs to feel like a continuation, not a restart, or it reads as the bar glitching.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    "A number is a claim about how much is left. Make that claim only when the system can actually back it up, and say plainly that it's still working when it can't.",
  mechanics:
    "A determinate bar binds its fill width to a real, changing value: bytes transferred over bytes total, records processed over records remaining. An indeterminate animation binds to nothing measurable at all; it loops on a fixed timer regardless of what's actually happening underneath it. Switching between them mid-task means swapping which of those two things the same visual element is actually reporting.",
}

export const typeToConfirmEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: "Should deleting something require typing its name to confirm?",
  keywords: ['type to confirm', 'typing to confirm', 'type the name', 'confirmation phrase', 'typed confirmation'],
  validation:
    "Adding friction to slow someone down is usually the wrong move, and that's true often enough to trust by default.",
  confirmingCase: {
    product: "A simple \"Are you sure?\" dialog",
    text: 'is already enough friction for most destructive actions: one deliberate click, with a real pause built in, catches the accidental case without asking for more than that.',
  },
  contradictingCase: {
    product: "GitHub's own repository-deletion flow",
    text: "requires typing the repository's exact name before the delete button even becomes clickable, specifically because a single click, no matter how deliberate it feels, is still something a practiced hand can do without the message ever landing. Typing forces a different kind of attention a click can't fake.",
  },
  sharperQuestion:
    "Same instinct, don't add unnecessary friction, and it's still right almost everywhere. What changes here isn't the rule. It's what counts as necessary once a mistake can't be undone at any cost.",
  explanation:
    "A click is something muscle memory can execute without the reason behind it ever registering. Typing a specific, correct string can't happen by reflex, which is exactly why it's reserved for the handful of actions where an accidental click would be genuinely catastrophic, not merely annoying.",
  principle:
    "Most actions deserve to be fast. Reserve the slow, deliberate kind for the rare action where a careless click and an unrecoverable mistake are the same click.",
}

export const optionalFieldEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Should I mark only the optional fields, and assume everything else is required?',
  keywords: ['optional field', 'required field', 'asterisk', 'mark required', 'mark optional'],
  mirrorClaim: 'Marking only the optional fields keeps a form cleaner, since most fields are required anyway.',
  contradiction: 'It keeps the form cleaner. It also leaves a measurable share of people guessing wrong.',
  explanation:
    "Baymard Institute's own large-scale usability testing found people don't reliably read an unmarked field as \"required\" the way the pattern assumes. In their testing, roughly a third of participants skipped a required field specifically because it carried no marking at all, having read the absence of a label as permission to leave it blank. The pattern trades a small, real visual cost, a few extra asterisks, for a much larger one: someone finding out a field was required only after the form rejects them.",
  evidence: {
    product: "Baymard Institute's own usability testing",
    text: 'found that marking only optional fields caused roughly 32% of users to fail to complete a field that was actually required, because the absence of a marking was read as permission to skip it.',
  },
  principle:
    "An unmarked field asks a real question: required, or not? Left to guess, people get it wrong often enough that the marking was never really optional to skip.",
}

export const onboardingTutorialEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Should new users get a guided tutorial, or figure out the product themselves?',
  keywords: ['onboarding tutorial', 'product tour', 'walkthrough', 'learn by doing', 'guided tour'],
  validation:
    "Guiding new users through what to do first sounds obviously right, and for genuinely complex products, it often is.",
  confirmingCase: {
    product: 'Complex, feature-dense tools',
    text: 'with real learning curves, design or spreadsheet software, for instance, tend to benefit from a guided first pass, because the cost of getting lost outweighs the cost of a short, optional walkthrough.',
  },
  contradictingCase: {
    product: 'Self-triggered product tours',
    text: 'see roughly double the completion rate of tours that launch automatically the moment someone opens the product, because a tour nobody asked for competes with the thing they actually came to do, and loses.',
  },
  sharperQuestion:
    "Same instinct, help people learn the product, pointed two different ways depending on one thing: whether the person asked to be taught, or was simply intercepted before they could start.",
  explanation:
    "A tutorial that's requested arrives at the exact moment curiosity is highest. A tutorial that's forced arrives at the exact moment someone was trying to do something else, which is why identical content gets finished by one group and clicked past by the other.",
  principle:
    "Teaching helps when it answers a question someone already has. Interrupting to teach something nobody asked about yet just delays the moment they'd actually want to learn it.",
}

export const swipeGestureEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should I use swipe gestures for actions like archive or delete on a list?',
  keywords: ['swipe gesture', 'swipe to delete', 'swipe action', 'swipe to archive', 'list gesture'],
  reframe:
    "There's more than one thing riding on this, and swipe-versus-button undersells how many of them there actually are.",
  variables: [
    {
      label: 'Whether a visible fallback exists too',
      text: "A swipe action that's the only way to do something will only ever be found by accident, or not at all, because nothing on screen suggests it's there. A swipe action that duplicates a button already visible in a menu costs nothing to add and loses nothing if someone never discovers it.",
    },
    {
      label: 'How often the action gets used',
      text: "Someone triaging a hundred emails a day will find and keep the swipe gesture through sheer repetition, whether or not it was obvious the first time. Someone who does the same action once a month never gets enough repetitions to build that memory, so first-time discoverability is the only chance the gesture gets.",
    },
    {
      label: 'What happens if it fires by accident',
      text: "Archiving something by an accidental swipe means a few extra seconds finding it again. Deleting something by an accidental swipe, on a gesture with no confirmation step, can mean losing the thing itself. The same motion carries a different amount of risk depending entirely on what it's bound to.",
    },
  ],
  mapIntro: 'Each of these argues separately. Together, they decide whether the gesture is worth adding at all.',
  principle:
    "A visible fallback. How often the gesture gets used. What happens if it fires by accident. Clear all three, and a swipe gesture earns its place, but the button underneath it still deserves to stay, for whoever never finds the gesture at all.",
}

export const emptyStateEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should an empty state use an illustration, or just plain text?',
  keywords: ['empty state', 'no results', 'illustration', 'blank state', 'zero state'],
  reframe:
    "Worth asking, and the sharper version of it is: is this the first time anyone's seen this space, or has something temporarily emptied it out?",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'first-time',
      choiceLabel: "Nobody's ever put anything here yet",
      leadIn: 'Then an illustration earns its place. This is the moment that sets the tone for everything after it.',
      reasoning:
        "A first-time empty state isn't really empty; it's the very first impression of what this part of the product is for. A little warmth here is doing real work: explaining what's supposed to show up and why it's worth adding something.",
      evidence: {
        product: 'Most SaaS onboarding empty states',
        text: 'pair a simple illustration with a single clear next action, precisely because this is often the first and only moment before real content exists to speak for itself.',
      },
      counterNote:
        'Plain text would still explain the same thing. It would just do it without the one moment the product gets to feel considered instead of unfinished.',
    },
    {
      value: 'filtered',
      choiceLabel: 'Something existed, and a filter or search just hid it',
      leadIn: "Then skip the illustration. This isn't a first impression, it's a dead end that needs a way out.",
      reasoning:
        "Nobody wants personality from a screen telling them their filters were too narrow. What they want is to know why nothing matched and how to undo it, as fast as possible, which a friendly drawing only delays.",
      evidence: {
        product: 'Most filtered search results',
        text: 'pair a plain, direct message with a clear button to reset filters, because the goal here is recovery speed, not tone.',
      },
      counterNote:
        "An illustration would still be technically fine here. It would just spend effort on a feeling nobody's actually looking for in this moment.",
    },
  ],
  dissolvingMove: {
    intro: "There's a third case, and it's really the first rule applied more carefully, not a new one.",
    content:
      "A dashboard showing several widgets that are all empty for different, unrelated reasons shouldn't repeat the same illustration in every one of them. One illustrated empty state reads as a moment. Five identical ones in a row read as a bug.",
    evidence: {
      product: 'Multi-widget dashboards',
      text: "that keep every panel's empty state to plain text, reserving illustration for the one, larger, page-level empty state, avoid the same drawing repeating itself into wallpaper.",
    },
    costNote:
      "It means deciding, per surface, which empty state is the actual moment and which ones are just supporting detail, instead of applying one rule everywhere.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    'An illustration is for the one time this space is actually being introduced. Everywhere else, the fastest way back to something useful is the kinder choice.',
  mechanics:
    "A first-time empty state and a filtered empty state can share the exact same layout and still need different content entirely, because one is explaining a feature that doesn't exist yet for this person, and the other is explaining a temporary condition that already has a known fix: clearing the filter.",
}

export const carouselEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Should I use a carousel or slider to show featured content on the homepage?',
  keywords: ['carousel', 'slider', 'rotating banner', 'homepage carousel', 'image slider'],
  mirrorClaim: 'A carousel lets me show more featured content in the same space, at no real cost.',
  contradiction: 'It shows more content. Almost nobody sees past the first slide to find out.',
  explanation:
    "A widely cited study found roughly 1% of visitors clicked a non-rotating carousel at all, and 84% of those clicks landed on the first slide alone, leaving the rest to split a sliver of attention nobody was giving them anyway. Nielsen's own usability testing on a real carousel found people ignored it outright: the same banner blindness that makes anything shaped like an ad get skipped on sight, rotating or not. The slots after the first one aren't really underperforming content. They're content nobody was ever going to reach.",
  evidence: {
    product: "Adobe's own conversion test for a financial services client",
    text: 'found removing a homepage slider entirely produced a 23% increase in sales, not because the content moved somewhere better, but because the slider itself had been costing attention rather than earning it.',
  },
  principle:
    "Three slides doesn't mean three chances to be seen. Only the first one reliably gets looked at; the other two are along for the ride.",
}

export const dragKeyboardEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Does drag-and-drop need a keyboard alternative to be accessible?',
  keywords: ['drag and drop', 'draggable', 'reorder list', 'keyboard accessible', 'single pointer'],
  validation:
    "Keyboard support really is the right instinct for most interactive elements, and it covers a lot of real accessibility ground.",
  confirmingCase: {
    product: 'Most buttons, menus, and form controls',
    text: 'become fully usable the moment they respond to Tab and Enter the same way they respond to a click: keyboard support alone genuinely closes the gap for a huge share of interactions.',
  },
  contradictingCase: {
    product: "WCAG's own Dragging Movements criterion",
    text: "specifically doesn't accept keyboard support as sufficient for drag operations, because someone using a touchscreen with no physical keyboard attached can't tab or arrow-key their way through a drag either. The requirement is a single-pointer alternative, a tap or a button, not a keyboard one.",
  },
  sharperQuestion:
    "Same instinct, make it keyboard accessible, and it's still the right first move almost everywhere. For dragging specifically, it solves the wrong half of the problem: the gap isn't just no-keyboard, it's no-keyboard and no-mouse at the same time.",
  explanation:
    "Keyboard accessibility assumes a keyboard exists to reach for. Someone on a phone reordering a list has neither a mouse nor a keyboard, only a finger, which is why the fix for dragging isn't an alternate input method, it's an alternate gesture: up and down buttons, or a text field, something a single tap or type can operate without dragging anything at all.",
  principle:
    "Keyboard support answers what if there's no mouse. Dragging raises a different question: what if there's no keyboard either, and the only input is a single tap.",
}

export const autoSaveEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should changes save automatically, or require an explicit save button?',
  keywords: ['auto-save', 'autosave', 'save button', 'explicit save', 'save changes'],
  reframe:
    "Reasonable place to start, and what actually settles it is whether this is a draft still being shaped, or a deliberate commit someone means to make on purpose.",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'draft',
      choiceLabel: "It's a document or draft still being worked on",
      leadIn: 'Then auto-save. Nobody thinks of editing a document as a series of things to remember to save.',
      reasoning:
        "The entire mental model of a document is continuous: someone is always mid-thought, never at a natural \"done\" point until they close it. Asking them to remember a save button turns an ordinary pause for thinking into a risk of losing the last ten minutes.",
      evidence: {
        product: 'Google Docs',
        text: 'has no save button at all, because the product\'s whole premise is that a document reflects its current state continuously, not a state someone chose to commit.',
      },
      counterNote:
        "An explicit save would still work. It would just add a chance to lose work to the one thing writing already doesn't need: a reminder.",
    },
    {
      value: 'commit',
      choiceLabel: "It's a deliberate change with real consequences",
      leadIn: "Then keep the explicit save. This is a decision, not a draft, and it deserves a moment where someone means it.",
      reasoning:
        "Account settings, permissions, and anything visible to other people carry real weight if it changes the instant someone's cursor passes through it. An explicit save is the difference between \"I was trying that out\" and \"I meant to do that,\" and removing it removes the second option entirely.",
      evidence: {
        product: 'Most account and permissions settings pages',
        text: 'keep an explicit save action specifically so a half-finished edit never silently becomes the live, visible state.',
      },
      counterNote:
        "Auto-save would still capture the same final state eventually. It would just remove the moment where someone could still be experimenting instead of deciding.",
    },
  ],
  dissolvingMove: {
    intro: "There's a third case worth naming: something that's both a draft and eventually a commitment.",
    content:
      "Auto-save the draft continuously, but keep a separate, deliberate action for the moment the draft becomes real: publishing a post, sharing a document, applying a setting. The safety net and the decision point don't have to be the same button.",
    evidence: {
      product: 'Most blogging and CMS platforms',
      text: 'auto-save every keystroke of a draft, and still require a distinct "Publish" action before anyone else can see it: continuous safety, plus one deliberate line to cross.',
    },
    costNote:
      "It means maintaining two different states, draft and published, and being precise about which changes belong to which.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    "Auto-save protects thinking that hasn't finished yet. An explicit save protects a moment where finishing was the point. Match the button to which one is actually happening.",
  mechanics:
    "Auto-save binds persistence to a timer or a change event, independent of anyone deciding anything. An explicit save binds persistence to a single deliberate action. A draft-then-publish flow runs both: the timer owns the draft, the button owns the commitment.",
}

export const timestampFormatEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should I show a relative timestamp, or the exact date and time?',
  keywords: ['relative timestamp', 'absolute timestamp', 'time ago', 'exact timestamp', 'date format'],
  reframe:
    "Fair question, and it splits into a few genuinely separate things rather than resolving into one answer.",
  variables: [
    {
      label: 'How urgently the moment matters',
      text: 'A comment posted "3 minutes ago" tells you something a date can\'t: this is happening right now, still live, worth a glance. That immediacy is the entire value relative time offers, and it\'s exactly what a feed or a chat needs.',
    },
    {
      label: 'Whether someone needs to act on the exact time later',
      text: 'A calendar invite, a contract, or a shared document has to mean the same thing next month as it does today. "2 weeks ago" keeps changing its own meaning every time someone reads it again, which makes it the wrong format for anything that needs to be referenced, not just noticed.',
    },
    {
      label: 'How old the moment already is',
      text: '"3 minutes ago" is more useful than a clock time. "3 years ago" is not; at that distance, a relative phrase stops helping and a real date becomes the more legible answer, which is why most relative-time systems quietly switch over past a certain age.',
    },
  ],
  mapIntro: 'None of these argues for one format everywhere. Together, they say when each one earns its place.',
  principle:
    "Urgency decides some of it. Whether someone needs to reference the exact moment later decides more. How old it already is decides the rest. A short-lived comment and a calendar invite were never going to want the same clock.",
}

export const notificationGranularityEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should notification settings be one master switch, or separate toggles per type?',
  keywords: ['notification settings', 'master switch', 'granular settings', 'notification toggle', 'notification preferences'],
  reframe:
    "Worth asking, and the honest answer depends on a few things that don't collapse into one setting.",
  variables: [
    {
      label: 'How differently people value each type',
      text: "If a direct mention and a weekly digest get treated as equally important, one switch is honest: there's nothing to differentiate. The moment some types are worth interrupting someone for and others aren't, one switch is hiding a real difference behind a single lever.",
    },
    {
      label: 'What one annoying type does to the rest',
      text: "X lets people turn off likes without touching mentions, for a real reason: someone who mutes one overwhelming category because there's no other way to quiet it will often just disable notifications entirely, taking the genuinely useful ones down with it.",
    },
    {
      label: 'How many toggles someone can actually manage',
      text: "A settings screen with two categories is a real choice. A settings screen with twenty is a maintenance chore nobody finishes, which is why granularity has a ceiling: past a certain count, smart defaults and grouped categories matter more than exposing every lever individually.",
    },
  ],
  mapIntro: 'Each of these pulls in its own direction. Where they land together is the actual answer for a given product.',
  principle:
    "Some notification types matter more than others; one switch can't tell them apart, and past a certain count, neither can twenty separate ones.",
}

export const iconLabelEntry: MisconceptionEntry = {
  kind: 'misconception',
  query: 'Can an icon alone communicate its meaning, without a text label?',
  keywords: ['icon label', 'icon only', 'icon without text', 'unlabeled icon', 'icon meaning'],
  mirrorClaim: 'A well-designed icon communicates its meaning on its own, without needing a text label.',
  contradiction: "A few do. Most don't, and the ones that fail tend to fail the same specific way: two different icons competing for the same meaning.",
  explanation:
    "Nielsen Norman Group's own research names the exact pattern: the heart and the star are both used across different products to mean favorite, bookmark, featured, and rating, sometimes on the same screen for different things. There's no universal icon dictionary anyone actually agreed to, so an icon's meaning is really a convention borrowed from whichever app someone used most recently, not a property of the shape itself.",
  evidence: {
    product: "Nielsen Norman Group's own icon-usability research",
    text: 'found that even common icons like the heart and star are frequently misread, precisely because their meaning varies from product to product and the two compete with each other for the same rough concept.',
  },
  principle:
    "The shape was never the message. A label is what turns a guess about a heart or a star into something certain, instead of hoping someone learned the same convention somewhere else.",
}

export const smartDefaultEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Should I pre-fill a form field with a likely-correct guess?',
  keywords: ['smart default', 'pre-filled', 'default value', 'prefilled form', 'pre-checked'],
  validation:
    "Defaulting to the most likely answer really does save real effort, and it's right often enough to be the sensible starting assumption.",
  confirmingCase: {
    product: "A country field defaulted to the visitor's detected locale",
    text: 'gets it right for the overwhelming majority of visitors, and getting it wrong costs one easy correction: notice the wrong country, pick the right one, done.',
  },
  contradictingCase: {
    product: 'Pre-checked marketing consent checkboxes',
    text: "apply the identical logic, save someone a click, to a question where being wrong isn't a quick fix: it's an unnoticed yes to something nobody meant to agree to. GDPR now specifically requires these to default unchecked, for exactly this reason.",
  },
  sharperQuestion:
    "Same instinct, guess the likely answer to save a click, and it's still reasonable almost everywhere. What changes here isn't the guess. It's whether getting the guess wrong is a correction or a consequence.",
  explanation:
    "A wrong locale gets noticed and fixed in one glance. A wrong consent checkbox often isn't noticed at all, because agreeing was never something anyone was watching for. The same default that saves time in one field quietly manufactures consent in another.",
  principle:
    "A default only works when being wrong is cheap to notice and easy to fix. The moment it's a yes nobody actually gave, the same shortcut that saves time in one field becomes the whole problem in another.",
}

export const stepperEntry: AtlasEntry = {
  kind: 'branch',
  query: 'Should I use a stepper (plus and minus buttons) or a text field for choosing a quantity?',
  keywords: ['stepper', 'quantity selector', 'plus minus buttons', 'numeric input', 'quantity input'],
  reframe:
    "Sensible place to start, and what actually decides it is how wide the range of realistic answers actually is.",
  branchPrompt: 'Quick gut check on your case:',
  branches: [
    {
      value: 'narrow',
      choiceLabel: 'Most people pick a number near 1 to 10',
      leadIn: 'Then use a stepper. Tapping is faster than typing for a range this small.',
      reasoning:
        "When almost everyone lands within a handful of clicks from the default, a stepper turns the whole interaction into two taps at most, and it structurally can't produce an invalid number the way a free-typed field can.",
      evidence: {
        product: 'Most cart quantity selectors',
        text: 'use a plus/minus stepper specifically because the realistic range, one to a handful of items, rarely justifies a keyboard.',
      },
      counterNote:
        'A text field would still work here. It would just ask someone to type what a single tap could have handled.',
    },
    {
      value: 'wide',
      choiceLabel: 'The range is wide or genuinely unpredictable',
      leadIn: 'Then use a text field. Nobody wants to tap a stepper 40 times.',
      reasoning:
        "A stepper's entire advantage disappears the moment the realistic range gets wide: 40 taps to reach a common value isn't fast, it's just a lot of clicking with extra steps. A typed number reaches any value in one motion regardless of how far it is from a default.",
      evidence: {
        product: 'Age or year-of-birth fields',
        text: 'use a direct numeric or date input, never a stepper, because the realistic range spans decades and no single default is close enough to make incrementing sensible.',
      },
      counterNote:
        'A stepper would still prevent some invalid entries. It would just make every large number a small ordeal to reach.',
    },
  ],
  dissolvingMove: {
    intro: "There's a third move for values that are usually small but occasionally need to jump.",
    content:
      'Pair a stepper with an editable number beside it: tap for the common case, type when the value needs to move further than a few clicks would reach comfortably.',
    evidence: {
      product: 'Most quantity fields on e-commerce and ticketing sites',
      text: 'combine a visible number with plus/minus controls flanking it, so either interaction reaches the same field.',
    },
    costNote:
      "It's two controls to build, test, and keep in sync instead of one, for a case that's genuinely common but not universal.",
  },
  principleBridge: "Notice what didn't change, even though the answer did:",
  principle:
    "A stepper is efficient exactly as far as its range is small and predictable. Past that point, it isn't a faster control, it's the same number of clicks with worse math.",
  mechanics:
    "A stepper binds each tap to a fixed increment of a bounded value; a text input binds directly to the value itself, unbounded except by validation. Pairing them means the stepper's increment and the field's typed value have to stay the same number, updated from either direction.",
}

export const settingsApplyEntry: MultiVariableEntry = {
  kind: 'multi-variable',
  query: 'Should a settings change apply immediately, or wait for an explicit Apply button?',
  keywords: ['settings apply', 'apply button', 'toggle switch settings', 'immediate effect', 'save settings'],
  reframe:
    "Reasonable question, and Nielsen Norman Group's own toggle guidelines already show it splits into more than one thing.",
  variables: [
    {
      label: 'Whether the change is easily reversible',
      text: "A toggle is trusted to act immediately because flipping it back is just as immediate: dark mode, notifications, anything a person can undo in the same motion they used to change it. A setting without an easy way back doesn't earn that same trust.",
    },
    {
      label: 'Whether it sits alone or inside a form',
      text: "A single, isolated toggle acting instantly is clear. The same toggle placed inside a longer form that needs its own Submit button becomes genuinely confusing, because nothing on screen tells someone which of their changes already took effect and which are still waiting.",
    },
    {
      label: 'Whether the effect is visible only to you',
      text: "A personal preference changing instantly costs nothing but a moment of surprise. A setting that changes what other people see, a shared document's permissions, for instance, deserves the pause an explicit step provides, precisely because undoing it isn't just undoing it for yourself.",
    },
  ],
  mapIntro: 'Each of these can point the same setting in a different direction. Together, they decide it.',
  principle:
    "Reversibility, whether it's isolated or bundled with other fields, and whether anyone besides you sees the effect. A toggle earns instant effect by clearing all three; failing any one of them is reason enough to ask first.",
}

export const pullToRefreshEntry: RuleInversionEntry = {
  kind: 'rule-inversion',
  query: 'Should I use pull-to-refresh, or a visible refresh button?',
  keywords: ['pull to refresh', 'pull-to-refresh', 'refresh button', 'refresh gesture'],
  validation:
    "Pull-to-refresh feels native on mobile, and for a feed sorted newest-first, that instinct is usually right.",
  confirmingCase: {
    product: 'Most social feeds and inboxes, sorted newest at the top',
    text: 'use pull-to-refresh naturally, because pulling down at the top of a newest-first list matches the direction new content actually arrives from.',
  },
  contradictingCase: {
    product: 'A vertically scrolling list sorted oldest-first',
    text: "breaks the same gesture: pulling down at the top would have to mean something entirely different, since new items belong at the bottom, not the top, and the gesture that felt obvious in a feed now points the wrong way.",
  },
  sharperQuestion:
    "Same gesture, and it only reads as natural when new content and \"pull down\" already agree on the same direction. The moment a list's own order disagrees with the gesture, the gesture stops being intuitive for anyone, not just new users.",
  explanation:
    "Pull-to-refresh was never universally natural. It was natural for one specific, common layout: newest content at the top. Change where new content belongs and the same physical motion no longer matches what it's supposed to cause, which is also why it needs a visible fallback regardless: a hidden gesture with no on-screen hint is invisible to anyone who hasn't already learned it elsewhere.",
  principle:
    "A gesture only feels obvious when it agrees with the layout it's attached to. Pull-to-refresh is intuitive exactly where new content already belongs at the top, and arbitrary everywhere else.",
}

export const atlasEntries: AtlasEntry[] = [
  deleteConfirmationEntry,
  infiniteScrollEntry,
  modalEntry,
  notificationBadgeEntry,
  progressIndicatorEntry,
  autoSaveEntry,
  emptyStateEntry,
  stepperEntry,
]

// findMatch (QueryInput.tsx) returns the first entry whose keywords match, so
// order here is match-priority, not authoring order: entries whose keywords
// are narrow, specific phrases go before topically-adjacent entries whose
// keywords are broader single words, so a query touching both doesn't get
// silently claimed by the broader one. typeToConfirmEntry (all five-plus-word
// phrases) is deliberately checked before deleteConfirmationEntry (whose
// keywords include the bare word "deleting", which a typed-confirmation
// query will naturally also contain). Same reasoning for settingsApplyEntry
// ahead of autoSaveEntry: a realistic settings-apply question ("need a save
// button") contains autoSaveEntry's own legitimate "save button" keyword,
// so the more specific, settings-scoped entry has to be checked first.
export const allEntries: Entry[] = [
  typeToConfirmEntry,
  settingsApplyEntry,
  ...atlasEntries,
  disabledButtonEntry,
  darkModeEntry,
  hamburgerMenuEntry,
  placeholderLabelEntry,
  errorColorEntry,
  optionalFieldEntry,
  notificationPermissionEntry,
  skeletonScreenEntry,
  formColumnsEntry,
  onboardingTutorialEntry,
  dragKeyboardEntry,
  clickCountEntry,
  adaptiveUiEntry,
  accountWallEntry,
  liveSearchEntry,
  tooltipTriggerEntry,
  swipeGestureEntry,
  carouselEntry,
  timestampFormatEntry,
  notificationGranularityEntry,
  iconLabelEntry,
  smartDefaultEntry,
  pullToRefreshEntry,
]
