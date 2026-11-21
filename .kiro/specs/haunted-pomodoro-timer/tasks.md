# Implementation Plan: Haunted Pomodoro Timer

All paths are relative to `halloween-pomodoro/`. Requirement numbers refer to `requirements.md`.

- [x] 1. Project skeleton
  - [x] 1.1 Create `index.html`, `style.css` and `app.js` and link them
    - _Requirements: 6.1_
  - [x] 1.2 Add inline SVG pumpkin, ghosts, bats, progress ring and graveyard
    - _Requirements: 6.2, 6.3, 6.8_

- [x] 2. Timer core
  - [x] 2.1 Define phase durations and state; format time as `MM:SS`
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 2.2 Implement start, pause, resume and reset using an end timestamp
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  - [x] 2.3 Wire mode tabs and the Space shortcut
    - _Requirements: 1.4, 2.5_
  - [x] 2.4 Re-sync on `visibilitychange`
    - _Requirements: 2.6_

- [x] 3. Phase switching and rounds
  - [x] 3.1 Implement `finishPhase()` with the focus, short break and long break rules
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 3.2 Add the "Auto-start next phase" setting and persist it
    - _Requirements: 3.4, 3.5_
  - [x] 3.3 Add the completion chime and end-of-phase notice
    - _Requirements: 3.6_
  - [x] 3.4 Render round dots and "Round N of 4" / "Set complete!"
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 4. Persistence
  - [x] 4.1 Load and save `{ date, count, cycle, autoStart }` with validation
    - _Requirements: 5.1, 5.2, 5.4_
  - [x] 4.2 Roll over at midnight; add the "clear" action
    - _Requirements: 5.2, 5.3_
  - [x] 4.3 Sync across tabs through the `storage` event
    - _Requirements: 5.5_

- [x] 5. Visual polish
  - [x] 5.1 Dark purple-black theme with orange accents
    - _Requirements: 6.1_
  - [x] 5.2 Ambient animation: floating ghosts, flying bats with wing flaps, drifting fog, twinkling stars
    - _Requirements: 6.3_
  - [x] 5.3 Running-state animation: pumpkin glow and flicker, ring pulse; end-of-phase shake and count bump
    - _Requirements: 6.4, 6.5_
  - [x] 5.4 Reduced-motion support
    - _Requirements: 6.7_

- [x] 6. Mode color schemes
  - [x] 6.1 Drive accent and pumpkin colors from CSS variables per mode
    - _Requirements: 6.6_
  - [x] 6.2 Replace the `hue-rotate` filter (bad stem and body colors) with explicit variable-based fills
    - _Requirements: 6.6_
  - [x] 6.3 Use a pale stem in Long Break so it stands out from the green pumpkin
    - _Requirements: 6.6_

- [x] 7. Responsive layout
  - [x] 7.1 Add mobile rules at 600px and below (dial size, spacing, title and timer size)
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 7.2 Shrink and move the moon; move the ghost below the stat cards
    - _Requirements: 7.4_
  - [x] 7.3 Make the ring overflow visible to remove the clipped glow box
    - _Requirements: 6.2_

- [x] 8. Verification
  - [x] 8.1 Fake-clock run through 4 focus rounds, 3 short breaks and 1 long break; check display, mode, button label, round text and count at each step; reload to check persistence
    - _Requirements: 1.1–1.3, 2.1–2.4, 3.1–3.4, 4.1–4.3, 5.1_
  - [x] 8.2 Screenshots at 375×667, 390×760 and 1100×800 in all three modes; confirm no horizontal overflow and that the computed ring, stem and pumpkin colors match each scheme
    - _Requirements: 6.6, 7.1, 7.2_
  - [x] 8.3 Write `README.md` describing features, files and how Kiro was used

- [ ] 9. Not yet verified
  - [ ] 9.1 Listen to the chime on a real device
    - _Requirements: 3.6_
  - [ ] 9.2 Test in Safari and Firefox
  - [ ] 9.3 Run a fake-clock test of the midnight rollover and the cross-tab `storage` sync
    - _Requirements: 5.2, 5.5_
  - [x] 9.4 Re-run the 8.1 cycle test after the latest CSS and markup changes (passed, no console errors)
    - _Requirements: 3.1–3.4_
