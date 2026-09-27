import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { LiquidButton, LiquidSwitch, SegmentedControl } from "../src";
import "./styles.css";

const tones = {
  aubergine: ["#55384f", "85 56 79"],
  ocean: ["#285a68", "40 90 104"],
  moss: ["#3f614e", "63 97 78"],
  ember: ["#6c3d31", "108 61 49"],
} as const;

const snippet = `import { SegmentedControl } from "liquid-plastic-ui";
import "liquid-plastic-ui/styles.css";

<SegmentedControl
  ariaLabel="Workspace view"
  options={[
    { value: "canvas", label: "Canvas" },
    { value: "layers", label: "Layers" },
    { value: "export", label: "Export" },
  ]}
  value={view}
  onValueChange={setView}
/>`;

function App() {
  const [view, setView] = useState("canvas");
  const [tone, setTone] = useState<keyof typeof tones>("aubergine");
  const [blur, setBlur] = useState(18);
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [accent, rgb] = tones[tone];
  const theme = { "--lp-accent": accent, "--lp-accent-rgb": rgb, "--lp-blur": `${blur}px` } as React.CSSProperties;

  return <main className="demo" style={theme}>
    <header className="demo-nav">
      <a className="demo-mark" href="#top" aria-label="Liquid Plastic UI home"><span />LP</a>
      <nav aria-label="Page"><a href="#components">Components</a><a href="#customize">Customize</a><a href="https://github.com/imjustinliao/Liquid-Plastic-UI">GitHub</a></nav>
    </header>

    <section className="hero" id="top">
      <p className="eyebrow">Open-source React components</p>
      <h1>Interfaces that feel poured,<br />not painted.</h1>
      <p className="lede">A small, accessible component system shaped from translucent wells, porcelain faces, responsive light, and physical motion.</p>
      <div className="hero-actions"><LiquidButton variant="primary" onClick={() => navigator.clipboard?.writeText("npm install liquid-plastic-ui")}>Copy install command</LiquidButton><a className="text-link" href="#components">Explore the primitives <span>↓</span></a></div>
      <div className="hero-control" data-testid="hero-segments">
        <SegmentedControl ariaLabel="Help sections" size="lg" options={[
          { value: "assistant", label: "Assistant" },
          { value: "support", label: "Support" },
          { value: "community", label: "Community" },
        ]} defaultValue="assistant" />
      </div>
    </section>

    <section className="section" id="components">
      <div className="section-heading"><p className="eyebrow">Three fundamentals</p><h2>One material. Every essential interaction.</h2><p>Selection, action, and state share the same optical rules while keeping native behavior and readable semantics.</p></div>
      <div className="component-grid">
        <article className="showcase" data-shot="segmented"><div className="showcase-copy"><span>01</span><h3>Segmented control</h3><p>A single-choice selector with a traveling physical face, roving keyboard focus, and flexible labels.</p></div><div className="stage"><SegmentedControl ariaLabel="Editor view" options={[{value:"canvas",label:"Canvas"},{value:"layers",label:"Layers"},{value:"export",label:"Export"}]} value={view} onValueChange={setView} /></div></article>
        <article className="showcase" data-shot="button"><div className="showcase-copy"><span>02</span><h3>Liquid button</h3><p>A tactile action surface with pointer-local light, press compression, and three hierarchy levels.</p></div><div className="stage button-row"><LiquidButton variant="primary" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save project"}</LiquidButton><LiquidButton onClick={() => setSaved(false)}>Preview</LiquidButton><LiquidButton variant="quiet">More</LiquidButton></div></article>
        <article className="showcase" data-shot="toggle"><div className="showcase-copy"><span>03</span><h3>Liquid switch</h3><p>A compact binary setting with a porcelain thumb and controlled or uncontrolled React state.</p></div><div className="stage toggle-row"><LiquidSwitch label="Atmosphere motion" checked={enabled} onCheckedChange={setEnabled} /><span className="state">{enabled ? "On" : "Off"}</span></div></article>
      </div>
    </section>

    <section className="section customizer" id="customize">
      <div className="section-heading"><p className="eyebrow">Designed to bend</p><h2>Make it yours without breaking the material.</h2><p>Change a handful of CSS custom properties. The highlights, edges, shadows, and states stay optically coherent.</p></div>
      <div className="customizer-grid">
        <div className="controls">
          <label><span>Accent</span><select value={tone} onChange={(event) => setTone(event.target.value as keyof typeof tones)}>{Object.keys(tones).map(name => <option key={name}>{name}</option>)}</select></label>
          <label><span>Glass blur <output>{blur}px</output></span><input type="range" min="0" max="32" value={blur} onChange={(event) => setBlur(Number(event.target.value))} /></label>
          <label><span>Corner shape</span><select onChange={(event) => document.querySelector<HTMLElement>(".demo")?.style.setProperty("--lp-radius", event.target.value)}><option value="999px">Capsule</option><option value="18px">Soft rectangle</option><option value="10px">Compact</option></select></label>
        </div>
        <div className="preview"><SegmentedControl ariaLabel="Preview density" options={[{value:"soft",label:"Soft"},{value:"balanced",label:"Balanced"},{value:"dense",label:"Dense"}]} defaultValue="balanced" /><LiquidButton variant="primary">Create space</LiquidButton><LiquidSwitch label="Live material" defaultChecked /></div>
      </div>
    </section>

    <section className="section code-section"><div><p className="eyebrow">Small API surface</p><h2>Install, import, compose.</h2><p>React is the only peer dependency. Styles ship as one CSS file and every visual token is overridable.</p></div><pre><code>{snippet}</code></pre></section>
    <footer><span>Liquid Plastic UI</span><span>MIT licensed · Built for remixing</span></footer>
  </main>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
