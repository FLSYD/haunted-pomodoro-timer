# Haunted Pomodoro

A Halloween-themed Pomodoro focus timer. One page, no dependencies, no build step.

## Run it

Open `index.html` in a browser.

## Features

- 25-minute focus, 5-minute short break, 15-minute long break after every 4th focus round.
- Start, pause, resume and reset. Space also starts and pauses.
- Phases switch on their own when a countdown ends. The "Auto-start next phase" checkbox decides whether the next one also starts running.
- Round counter (four pumpkin dots) and a count of today's completed rounds, saved in `localStorage` and reset each day.
- Dark purple-black theme with orange accents, SVG pumpkin, ghosts, bats, moon, fog and a graveyard. Animations are disabled when the browser asks for reduced motion.
- Layout adapts down to phone widths.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup and inline SVG illustrations |
| `style.css` | Theme, layout, animations, mobile rules |
| `app.js` | Timer logic, persistence, rendering, completion chime |

## How Kiro was used

This app was built in a Kiro Web session in Vibe mode, by prompting in chat.

1. **Build.** Kiro wrote the three files from a one-paragraph brief (timer modes, round counter, local storage, haunted theme).
2. **Refactor.** On request, Kiro reorganized `app.js` into storage, timer, rendering, sound and event sections, and added the auto-start option.
3. **Verify.** Kiro drove the page with Playwright and a fake clock to run the full cycle in seconds. It checked the countdown, pause, automatic switching from focus to short break to focus, the long break after round 4, and that today's count survives a reload.
4. **Visual review.** Kiro took screenshots at desktop (1100px) and phone (375x667) sizes and used them to fix a clipped glow around the timer ring and a crowded phone header.

Not covered by those checks: the completion chime (headless browsers have no audio output) and browsers other than Chromium.
