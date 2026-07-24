# Replace the intro MR monogram with a new generated logo

## What changes

1. **Generate a new logo asset**
   - Use the image generator (premium tier, transparent background) to create a luxury MR monogram — vertical cartouche frame, interlocking serif M+R cipher, hairline engraving details, ink-black on transparent.
   - Save to `src/assets/mr-monogram.png`.

2. **Use the new logo in the Hero intro**
   - In `src/components/hero/SpotlightReveal.tsx`, replace the inline `MRMonogram` SVG component with an `<img src={mrMonogram} />` (imported from `src/assets/mr-monogram.png`).
   - Keep existing sizing, glow, spotlight, and timeline behavior untouched — same wrapper, same fade/scale animation.
   - Remove the now-unused vector path code for `MRMonogram`.

3. **No other changes**
   - Hero composition, theme toggle, welcome rotator, and downstream chapters stay as-is.
   - The favicon and `WelcomeRotator` monogram (if any) are out of scope unless you also want them swapped.

## Technical notes

- Asset lives at `src/assets/mr-monogram.png` and is imported directly (Vite handles the URL).
- Transparent PNG so it sits cleanly on both light and dark themes; if the dark theme needs an inverted variant, we can add a CSS `filter: invert()` on `[data-theme="dark"]` rather than generating a second image.
