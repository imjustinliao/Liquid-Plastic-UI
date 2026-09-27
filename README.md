# Liquid Plastic UI

[![CI](https://github.com/imjustinliao/Liquid-Plastic-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/imjustinliao/Liquid-Plastic-UI/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-171a1f.svg)](LICENSE)
[![React 18+](https://img.shields.io/badge/React-18%2B-55384f.svg)](https://react.dev/)

Tactile, accessible React controls shaped from translucent wells, centered light, and water-like physical motion.

Liquid Plastic UI turns the material language behind a polished segmented selector into a small component library. It has strong defaults, a compact API, and CSS variables for customization—without an animation runtime.

## Install

The repository is ready to publish as `liquid-plastic-ui`. Until the first npm registry release, install the public GitHub package directly:

```bash
npm install github:imjustinliao/Liquid-Plastic-UI
```

After the first registry release:

```bash
npm install liquid-plastic-ui
```

React and React DOM 18 or newer are peer dependencies.

## Thirty-second example

```tsx
import { useState } from "react";
import { SegmentedControl } from "liquid-plastic-ui";
import "liquid-plastic-ui/styles.css";

export function ViewPicker() {
  const [view, setView] = useState("canvas");

  return (
    <SegmentedControl
      ariaLabel="Workspace view"
      options={[
        { value: "canvas", label: "Canvas" },
        { value: "layers", label: "Layers" },
        { value: "export", label: "Export" },
      ]}
      value={view}
      onValueChange={setView}
    />
  );
}
```

## Three fundamentals

### Segmented control

A single-choice selector with a shared traveling face. It supports controlled and uncontrolled state, disabled options, equal or content-sized segments, and Arrow/Home/End navigation.

![Segmented control with Canvas, Layers, and Export options](https://raw.githubusercontent.com/imjustinliao/Liquid-Plastic-UI/main/docs/images/segmented.png)

When the segments reveal content panels, use tab semantics and connect each option to its panel:

```tsx
<SegmentedControl
  semantics="tabs"
  ariaLabel="Help sections"
  options={[
    { value: "assistant", label: "Assistant", panelId: "assistant-panel", tabId: "assistant-tab" },
    { value: "support", label: "Support", panelId: "support-panel", tabId: "support-tab" },
  ]}
  value={tab}
  onValueChange={setTab}
/>

<section id={`${tab}-panel`} role="tabpanel" aria-labelledby={`${tab}-tab`}>
  {/* active panel */}
</section>
```

### Liquid button

A native button with `primary`, `secondary`, and `quiet` hierarchy. Pointer-local reflection and a pointer-origin ripple provide feedback; pressure deepens the face without moving it.

![Primary, secondary, and quiet liquid buttons](https://raw.githubusercontent.com/imjustinliao/Liquid-Plastic-UI/main/docs/images/button.png)

```tsx
<LiquidButton variant="primary">Save project</LiquidButton>
<LiquidButton>Preview</LiquidButton>
<LiquidButton variant="quiet">More</LiquidButton>
```

### Liquid switch

A binary switch with controlled or uncontrolled state and a visible text label.

![Enabled liquid switch labeled Atmosphere motion](https://raw.githubusercontent.com/imjustinliao/Liquid-Plastic-UI/main/docs/images/toggle.png)

```tsx
<LiquidSwitch
  label="Atmosphere motion"
  checked={motion}
  onCheckedChange={setMotion}
/>
```

## Why it feels different

- Front-facing light keeps every edge equally weighted—no heavy lower shadow.
- One frosted carrier holds one raised selection face.
- Hover keeps the centered contour and adds only a faint bounded caustic at the pointer.
- Press feedback begins on pointer-down: one hollow wave expands from the exact contact point while concentric shading deepens without changing layout.
- Resting controls do no continuous animation work.
- Motion uses compositor-friendly transforms and opacity.

## Customize

Set tokens on any ancestor. Components inherit them naturally.

```css
.my-product {
  --lp-accent: #285a68;
  --lp-ink: #12161a;
  --lp-muted: #4b5660;
  --lp-radius: 18px;
  --lp-blur: 22px;
  --lp-duration: 320ms;
  --lp-ripple-duration: 520ms;
  --lp-ripple-ease: cubic-bezier(.22, 1, .36, 1);
  --lp-control-height: 46px;
  --lp-reflection-opacity: .32;
}
```

| Token | Default | Purpose |
| --- | --- | --- |
| `--lp-accent` | `#55384f` | Primary buttons and enabled switches |
| `--lp-ink` | `#171a1f` | Primary text |
| `--lp-muted` | `#4f5864` | Unselected labels |
| `--lp-radius` | `999px` | Shared control silhouette |
| `--lp-blur` | `18px` | Segmented carrier backdrop blur |
| `--lp-duration` | `420ms` | Sliding face settle time |
| `--lp-ease` | spring-like curve | Sliding face easing |
| `--lp-ripple-duration` | `520ms` | Pointer-origin wave travel time |
| `--lp-ripple-ease` | critically damped curve | Pointer-origin wave propagation |
| `--lp-control-height` | `44px` | Default control target height |
| `--lp-segment-gap` | `2px` | Space between segments |
| `--lp-reflection-opacity` | `.42` | Hover caustic strength |
| `--lp-face` | centered radial gradient | Resting porcelain face |
| `--lp-face-selected` | centered radial gradient | Selected segment face |
| `--lp-well` | centered radial gradient | Segmented carrier fill |
| `--lp-face-shadow` | symmetric shadow stack | Resting face depth |
| `--lp-well-shadow` | symmetric shadow stack | Carrier depth |

Use a dark enough accent to retain readable white text. Consumers remain responsible for contrast after overriding colors.

## Component API

### `SegmentedControl`

| Prop | Type | Default |
| --- | --- | --- |
| `options` | `SegmentOption[]` | required |
| `ariaLabel` | `string` | required |
| `value` / `defaultValue` | `string` | first enabled option |
| `onValueChange` | `(value) => void` | — |
| `semantics` | `"selection" \| "tabs"` | `"selection"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `equalWidth` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |

Each option accepts `value`, `label`, `disabled`, `ariaLabel`, `panelId`, and `tabId`.

### `LiquidButton`

Extends native button props and forwards its ref.

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "quiet"` | `"secondary"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `loading` | `boolean` | `false` |

### `LiquidSwitch`

Extends native button props and forwards its ref.

| Prop | Type | Default |
| --- | --- | --- |
| `checked` / `defaultChecked` | `boolean` | `false` |
| `onCheckedChange` | `(checked) => void` | — |
| `label` | `string` | — |

Provide either `label` or `aria-label` so the switch always has an accessible name.

## Accessibility

- Native buttons and WAI-ARIA radio/tab/switch semantics.
- Roving focus with Arrow, Home, and End keys in segmented controls.
- Visible `:focus-visible` rings independent from hover lighting.
- At least 44px default pointer targets.
- Reduced-motion removes ripples and travel while preserving state feedback.
- Reduced-transparency replaces blur with a solid carrier.
- Increased contrast and forced-colors modes receive explicit borders.
- No DOM access during module evaluation, so server rendering remains safe.

## Local playground

```bash
git clone https://github.com/imjustinliao/Liquid-Plastic-UI.git
cd Liquid-Plastic-UI
npm install
npm run dev
```

Then open [http://localhost:4173](http://localhost:4173).

Useful checks:

```bash
npm run check
npm test
npm run test:browser
npm run build
npm run build:demo
npm run test:package
npm run screenshots
```

## Contributing

Issues, experiments, and forks are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Keep new components accessible, zero-idle-work at rest, and faithful to the shared material principles.

## License

[MIT](LICENSE) © 2026 Justin Liao. Use it, adapt it, ship it, or fork it.
