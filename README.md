# Shake to Shrink

A functional web prototype for an HCI project exploring gesture-activated one-handed smartphone typing.

Type on the custom keyboard, shake the phone to shrink it toward your selected hand, and shake again to restore full width.

## Status

This is the original working baseline, before the planned edge-to-edge mobile redesign. The project owner tested motion permission and shake switching successfully on an iPhone. Browser checks covered typing, backspace, shift, compact layout, left/right alignment, and restoration. No participant study has been conducted and no performance improvement is claimed.

## Features

- Custom QWERTY keyboard with shift, numbers, punctuation, space, return, and backspace
- Full-width and compact modes within the current demo card
- Manual left/right hand preference
- Adjustable compact width and shake threshold
- Motion permission handling and sensor diagnostics
- Short cooldown between shake-triggered switches

## Open in VS Code

Open this folder in VS Code. Source files are in `dist/`; this is hand-written source, not generated build output. There are no npm dependencies or build steps.

For desktop layout testing, run from the project root (Python required):

```powershell
py -m http.server 8000 --directory dist
```

Then open http://localhost:8000. On systems using `python3`, substitute that for `py`.

Motion testing on a phone requires an HTTPS deployment. Opening an HTTP LAN address or a local file is not a substitute. Serve the contents of `dist/` with an HTTPS static host. GitHub Pages is one possible deployment target; hosting is not configured in this package.

## Phone test

1. Open the deployed HTTPS page directly in your mobile browser.
2. Tap Enable shake and grant motion access if requested.
3. Confirm the page reports motion is active.
4. Type using the custom keyboard.
5. Give the phone a short gentle shake; verify compact mode.
6. Wait about two seconds and shake again; verify full width.
7. Test both hands and adjust sensitivity if needed.

The manual toggle verifies layout only, not sensor detection.

## Files

- `dist/index.html`: interface and controls
- `dist/style.css`: layout and keyboard styling
- `dist/app.js`: text entry, keyboard state, permissions, and shake detection
- `NEXT_STEPS.md`: agreed scope for the next coding session

## Limitations

The keyboard works only inside this page; it is not a system keyboard. Holding hand is selected manually. There is no autocorrect, arbitrary caret placement, or hold-to-repeat deletion yet. Settings and entered text reset on reload. The current mobile keyboard is inside a padded card, which the next milestone will replace with an edge-to-edge layout. Physical-phone regression tests remain necessary after changes.

## Privacy

Application code keeps entered text in page memory and does not send it to a server. Google Fonts is loaded externally for typography. The hosting provider may maintain its own access logs.

## Research plan

Later evaluation will compare full-width typing, manual compact-mode activation, and shake activation. Planned measures include activation time, typing speed, text errors, accidental activation, and perceived comfort. Evaluation is deferred until after the progress presentation.
