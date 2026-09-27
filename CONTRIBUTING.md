# Contributing

Thanks for helping Liquid Plastic UI become more useful without losing what makes it feel physical.

## Start locally

```bash
npm install
npm run dev
```

The playground runs at `http://localhost:4173` and imports the same source entry that the package builds.

## Before a pull request

Run:

```bash
npm run check
npm test
npm run test:browser
npm run build
npm run test:package
```

If your change affects appearance, regenerate the documentation images with `npm run screenshots` and inspect desktop and narrow layouts.

## Component principles

- Preserve native semantics before adding visual behavior.
- Keep the default target at least 44px.
- Use one transmitting carrier and one selected face per group.
- Keep lighting front-facing and balanced around the perimeter.
- Animate transforms and opacity; do not animate blur or layout geometry frame by frame.
- Keep resting components idle.
- Support reduced motion, reduced transparency, higher contrast, keyboard focus, and touch input.
- Avoid runtime dependencies unless they materially improve the public API.

## Commit style

Use `vMAJOR.MINOR.PATCH - Description`, beginning with `v0.0.0`. Keep the description to 1–15 words and omit the final period.
