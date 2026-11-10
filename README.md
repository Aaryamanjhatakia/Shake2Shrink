# Shake to Shrink

A functional web prototype for an HCI project exploring gesture-activated one-handed smartphone typing.

Type on the custom keyboard, shake the phone to shrink it toward your selected hand, and shake again to restore full width.

## Status

The React + TypeScript + Vite prototype now has a mobile-first dark notes interface, an edge-to-edge keyboard, and a modal settings panel. The original shake detector and cooldown are preserved. The project owner previously tested the baseline on an iPhone; the redesigned version still needs physical-phone regression testing. No participant study has been conducted.

## Features

- Custom QWERTY keyboard with shift, numbers, punctuation, space, return, and backspace
- Edge-to-edge full-width mobile keyboard and left/right compact modes with a restore arrow
- Manual left/right hand preference
- Adjustable compact width and shake threshold
- Motion permission handling and sensor diagnostics
- Short cooldown between shake-triggered switches

## Development

Use Node.js 22.12 or newer (Node 24 is supported). Open this folder in VS Code, then run:

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite. Source files live in `src/`; Vite reloads the page as you edit them.

```powershell
npm run typecheck    # Strict TypeScript checks
npm test             # Component and synthetic motion regression tests
npm run build        # Type-check and generate the production site in dist/
npm run preview      # Serve the production build locally
npm run format       # Format source and configuration
```

`dist/` is now generated output, not source. Do not edit it. Deploy its contents to an HTTPS static host after running `npm run build`. Relative asset paths support hosting under a repository subdirectory. Hosting is not configured in this repository.

Motion testing on a phone requires HTTPS. An HTTP LAN address or local file is not a substitute. The development and preview servers are for local checks; use an HTTPS deployment for physical-phone testing.

## Architecture

- `src/App.tsx`: page composition and shared layout/settings state
- `src/components/`: keyboard, settings, typing area, and motion status
- `src/hooks/useKeyboard.ts`: text entry and physical keyboard events
- `src/hooks/useMotion.ts`: permission handling, sensor subscription, status, and lifecycle cleanup
- `src/motion/shakeDetector.ts`: gravity filtering, two-peak detection, and cooldown
- `src/styles.css`: existing responsive layout and reduced-motion styling
- `src/**/*.test.tsx` and `src/**/*.test.ts`: migration regression checks
- `index.html`, `vite.config.ts`, `tsconfig.json`: entry point and tooling
- `NEXT_STEPS.md`: redesign status and follow-up scope

React owns the UI and its state. Sensor listeners and timers are cleaned up when paused or unmounted. Text and preferences remain in memory only; there is no backend or evaluation logging.

## Phone test

1. Open the deployed HTTPS page directly in your mobile browser.
2. Tap Enable motion and grant motion access if requested.
3. Confirm the page reports motion is active.
4. Type using the custom keyboard.
5. Give the phone a short gentle shake; verify compact mode.
6. Wait about two seconds and shake again; verify full width.
7. Open Settings, test both hands and adjust sensitivity if needed. Confirm the note survives opening/closing Settings.
8. Use the arrow beside the compact keyboard to restore full width. Verify the keyboard reaches both screen edges in full mode and clears the home indicator.
9. Type a long note; the writing area should scroll while the keyboard stays at the bottom. Tap the writing area and confirm the native keyboard stays closed.
10. Switch away from Safari and return; verify shakes still work and ordinary typing does not trigger a switch.

To test an updated build, run `npm run build`, upload `dist/` to your HTTPS host, and open that address directly in Safari. A configured HTTPS tunnel to `npm run dev` is also suitable for live development; this project does not configure a tunnel automatically.

The manual toggle verifies layout only, not sensor detection.

## Limitations

Redesign verification (November 5, 2026): see `VERIFICATION.md` for automated test results and real-browser layout measurements. Physical iPhone checks remain outstanding, including Safari browser chrome, home-indicator insets, motion permission, real shakes, cooldown, accidental activation, and background/resume.

The keyboard works only inside this page; it is not a system keyboard. Holding hand is selected manually. There is no autocorrect, arbitrary caret placement, or hold-to-repeat deletion yet. Settings and entered text reset on reload. The writing area is read-only to avoid opening the native phone keyboard; use the custom keys. Physical-phone regression tests remain necessary after changes.

## Privacy

Application code keeps entered text in page memory and does not send it to a server. Typography uses system monospace fonts; no external font request is needed. The hosting provider may maintain its own access logs.

## Research plan

Later evaluation will compare full-width typing, manual compact-mode activation, and shake activation. Planned measures include activation time, typing speed, text errors, accidental activation, and perceived comfort. Evaluation is deferred until after the progress presentation.
