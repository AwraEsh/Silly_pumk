# Halloween artwork — final handoff

October 30, 2026, Asia/Tehran.

## Final user direction

A single empty forest scene, one central, goofy Halloween pumpkin with tiny eyes, an oversized open mouth, and a single upper tooth, fancy **Happy Halloween** lettering, and a small **From Silly Arash** credit. The bird, house, lantern, distant figure, eyes, discoveries, buttons, date, long copy, invitation, sound, and particles have been removed. The later interaction request adds a small native JavaScript Easter egg. The credit itself preserves the Telegram link without adding another label.

## Implementation

The forest and pumpkin are editable SVG assets. Fonts are local. Idle motion consists of faint CSS mist and a slow haunted drift of the greeting, both disabled by reduced-motion preferences. The pumpkin has no eyebrows. A small sans-serif caption above it reads exactly `this is my pumpkin bro`. Mobile uses a two-line greeting and a separate forest crop. Safe-area insets are respected. All asset URLs are relative for GitHub Pages.

## Evidence and limits

The final-page screenshots and measurements in `verification/` replace evidence from the earlier interactive version. Checked at 320×740, 360×800, 390×844, 768×1024, 1440×900, and 844×390: no horizontal overflow, the pumpkin loads, one accessible pumpkin button and one local script, and the greeting, small caption, and credit are present. No uncaught Chromium runtime errors were observed.

Physical phone, Safari, and Firefox inspection remain unperformed.

## Publishing

Repository: https://github.com/AwraEsh/Silly_pumk

GitHub Pages is configured to publish the root of `main` at https://awraesh.github.io/Silly_pumk/. Subsequent pushes to `main` update the website. The repository is public, as required for this Pages deployment.

## Pumpkin burst

Six clicks/taps within a rolling 1000ms window trigger a 140ms pressure swell followed by a burst from the pumpkin's center. Mobile uses 40 textured rind fragments plus a stem and exactly one tooth; desktop uses 48 rind fragments plus those two pieces. Ballistic trajectories are precomputed, with gravity, side collisions, rotation, and damped floor bounces, then played by native Web Animations. The title always has blood-darkened ink and slow motion; on explosion it receives blood droplets and dripping stains. The entire page reloads 5000ms after the actual burst.

`verification/burst-results.json` records real-browser input checks: slow taps and five fast taps do not burst; the sixth fast tap does; one tooth is created; blood appears; the pumpkin remains broken before the deadline; automatic reload restores it and removes debris. Both regular and reduced motion passed without uncaught runtime errors or horizontal overflow. Reduced motion skips the pressure swell and flight, fading fragments locally instead; the five-second reset still applies. Keyboard button activation also uses the same click handler. Physical-device feel remains unverified.
