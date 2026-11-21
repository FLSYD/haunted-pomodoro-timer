# Requirements: Haunted Pomodoro Timer

## Introduction

A single-page, Halloween-themed Pomodoro focus timer. It runs entirely in the browser with no backend, no build step and no dependencies. The app lives in `halloween-pomodoro/` (`index.html`, `style.css`, `app.js`).

## Glossary

- **Phase**: one countdown, either Focus, Short Break or Long Break.
- **Round**: one completed Focus phase.
- **Set**: four consecutive rounds. A Long Break follows the fourth.
- **Today's rounds**: the number of rounds completed since local midnight.

## Requirements

### Requirement 1: Timer phases

**User Story:** As a user, I want standard Pomodoro intervals, so that I can alternate focused work and rest.

#### Acceptance Criteria

1. THE app SHALL provide a Focus phase of 25 minutes, a Short Break of 5 minutes and a Long Break of 15 minutes.
2. THE app SHALL display the remaining time as `MM:SS`.
3. WHEN the page loads, THE app SHALL show the Focus phase at 25:00 in a stopped state.
4. WHEN the user selects a mode tab, THE app SHALL stop any running countdown and show that phase at its full duration.

### Requirement 2: Timer controls

**User Story:** As a user, I want to start, pause and reset the timer, so that I control my sessions.

#### Acceptance Criteria

1. WHEN the user activates Start, THE app SHALL count down once per second of real time.
2. WHILE the timer is running, THE primary button SHALL read "Pause". WHEN activated, THE app SHALL stop the countdown and keep the remaining time.
3. WHILE the timer is paused with time elapsed, THE primary button SHALL read "Resume".
4. WHEN the user activates Reset, THE app SHALL stop the countdown and restore the current phase to its full duration.
5. WHEN the user presses Space with focus on the page body, THE app SHALL toggle start and pause.
6. THE countdown SHALL be derived from a stored end timestamp, so that background-tab timer throttling does not make it drift.

### Requirement 3: Automatic phase switching

**User Story:** As a user, I want the app to move between focus and break on its own, so that I do not manage the cycle by hand.

#### Acceptance Criteria

1. WHEN a Focus phase reaches 00:00 and fewer than four rounds of the set are complete, THE app SHALL switch to the Short Break.
2. WHEN the fourth Focus phase of a set reaches 00:00, THE app SHALL switch to the Long Break and start a new set.
3. WHEN a Short Break or Long Break reaches 00:00, THE app SHALL switch to the Focus phase.
4. WHERE "Auto-start next phase" is enabled, THE app SHALL start the next phase running immediately. Otherwise THE app SHALL show the next phase stopped at its full duration.
5. THE "Auto-start next phase" setting SHALL default to enabled and SHALL persist across reloads.
6. WHEN a phase ends, THE app SHALL play a short chime and show a one-line notice naming what finished.

### Requirement 4: Round counter

**User Story:** As a user, I want to see where I am in the set, so that I know when the long break is coming.

#### Acceptance Criteria

1. THE app SHALL show four indicators for the current set, with completed rounds filled and the active round highlighted.
2. THE app SHALL show text "Round N of 4" during Focus and Short Break phases.
3. WHILE the Long Break is the current phase, THE app SHALL show all four indicators filled and the text "Set complete!".

### Requirement 5: Today's completed rounds

**User Story:** As a user, I want a daily tally that survives reloads, so that I can see my progress.

#### Acceptance Criteria

1. WHEN a Focus phase completes, THE app SHALL increase today's rounds by one and save it to `localStorage`.
2. THE app SHALL store the local calendar date with the count. WHEN the stored date differs from today's date, THE app SHALL treat the count and set progress as zero.
3. WHEN the user activates "clear" and confirms, THE app SHALL reset today's rounds and set progress to zero.
4. IF `localStorage` is unavailable or contains invalid data, THEN THE app SHALL continue working with in-memory values.
5. WHEN the stored data changes in another tab, THE app SHALL update its display.
6. Skipping or resetting a phase before it reaches 00:00 SHALL NOT count as a completed round.

### Requirement 6: Haunted visual theme

**User Story:** As a user, I want a spooky, polished look, so that focusing feels fun.

#### Acceptance Criteria

1. THE app SHALL use a deep purple-black background with orange accents.
2. THE app SHALL show an SVG jack-o'-lantern inside a circular progress ring that empties as time passes.
3. THE app SHALL show ghosts, bats, a moon, stars, fog and a graveyard silhouette as background decoration.
4. WHILE the timer is running, THE pumpkin face SHALL glow and flicker and the ring SHALL pulse.
5. WHEN a phase ends, THE pumpkin SHALL shake and, for a Focus phase, the today's-rounds number SHALL bump.
6. WHILE the mode is Short Break, THE accent color, ring, timer text and pumpkin SHALL use a purple scheme. WHILE the mode is Long Break, they SHALL use a green scheme.
7. WHERE the user's system requests reduced motion, THE app SHALL disable animations.
8. Decorative graphics SHALL be hidden from assistive technology.

### Requirement 7: Responsive layout

**User Story:** As a mobile user, I want the app to fit my phone, so that I can use it without zooming or sideways scrolling.

#### Acceptance Criteria

1. AT viewport widths from 375px to 1100px, THE page SHALL NOT scroll horizontally.
2. AT widths of 600px or less, THE app SHALL reduce spacing and the dial size so that the controls and both stat cards are visible on a 390×760 screen.
3. Primary controls SHALL be at least 44px tall.
4. Decorative elements SHALL NOT cover the title or the stat cards' text.

## Out of scope

- User-configurable durations.
- Accounts, sync between devices and history beyond today.
- Desktop notifications.
