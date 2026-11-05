# Next coding session: mobile typing interface

Preserve the working shake interaction while redesigning the UI. Do not introduce a framework or evaluation logging.

## Required changes

1. On mobile, remove the keyboard's enclosing card and horizontal outer padding. Full-width keyboard bounds should span the viewport.
2. Anchor the keyboard to the viewport bottom and account for the iPhone home indicator using safe-area insets.
3. Compact mode should use roughly 75–80% of the same available width, align to the selected hand, and leave usable empty space beside it.
4. Put a reachable restore control in that empty space.
5. Replace the large slogan and decorative onboarding layout with a small header, large typing area, and familiar neutral keyboard styling.
6. Move hand, width, sensitivity, and diagnostics into an accessible settings panel. Keep the motion-permission action easy to find until enabled.
7. Show brief, unobtrusive mode feedback after a gesture.
8. Keep a bounded preview on desktop; preserve reduced-motion support.

## Follow-up refinements

- Hold backspace to delete repeatedly; cancel on release, pointer cancellation, and leaving the control.
- Double-tap shift for caps lock, with visible and accessible state.
- Persist non-sensitive preferences locally, with graceful handling if storage is unavailable.

## Acceptance checks

- Verify edge-to-edge full mode at narrow and wide phone widths, with no horizontal overflow.
- Verify left/right compact bounds and preservation of typed text across mode changes.
- Verify all keyboard controls and settings still work.
- Test permission accepted, denied, unsupported device, and no sensor data states.
- On the physical iPhone, verify intentional shakes, cooldown, ordinary typing, and background/resume behavior.
- Record actual test results; do not claim motion was verified through a manual toggle.

## Deferred

Participant evaluation, system-wide keyboard integration, automatic holding-hand detection, autocorrect, and prediction.
