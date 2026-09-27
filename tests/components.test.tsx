import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { LiquidButton, LiquidSwitch, SegmentedControl } from "../src";

describe("Liquid Plastic components", () => {
  it("moves segmented selection with click and arrow keys", () => {
    const onChange = vi.fn();
    render(<SegmentedControl ariaLabel="View" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }, { value: "c", label: "Gamma", disabled: true }]} defaultValue="a" onValueChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Beta" }));
    expect(onChange).toHaveBeenLastCalledWith("b");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Beta" }), { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("a");
  });

  it("supports controlled switch semantics", () => {
    const onChange = vi.fn();
    const { rerender } = render(<LiquidSwitch label="Motion" checked={false} onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Motion" }));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<LiquidSwitch label="Motion" checked onCheckedChange={onChange} />);
    expect(screen.getByRole("switch", { name: "Motion" })).toHaveAttribute("aria-checked", "true");
  });

  it("can expose tab semantics when it controls panels", () => {
    render(<SegmentedControl semantics="tabs" ariaLabel="Help sections" options={[{ value: "assistant", label: "Assistant", panelId: "assistant-panel", tabId: "assistant-tab" }, { value: "support", label: "Support", panelId: "support-panel", tabId: "support-tab" }]} defaultValue="assistant" />);
    expect(screen.getByRole("tablist", { name: "Help sections" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Assistant" })).toHaveAttribute("aria-controls", "assistant-panel");
    expect(screen.getByRole("tab", { name: "Assistant" })).toHaveAttribute("id", "assistant-tab");
    expect(screen.getByRole("tab", { name: "Assistant" })).toHaveAttribute("aria-selected", "true");
  });

  it("reconciles selection when the selected option is removed", () => {
    const onChange = vi.fn();
    const view = render(<SegmentedControl ariaLabel="View" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} defaultValue="b" onValueChange={onChange} />);
    view.rerender(<SegmentedControl ariaLabel="View" options={[{ value: "a", label: "Alpha" }]} defaultValue="b" onValueChange={onChange} />);
    expect(within(view.container).getByRole("radio", { name: "Alpha" })).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenLastCalledWith("a");
  });

  it("renders on the server without requiring browser globals", () => {
    expect(renderToString(<SegmentedControl ariaLabel="View" options={[{ value: "a", label: "Alpha" }]} />)).toContain("radiogroup");
  });

  it("disables a loading button and preserves its accessible name", () => {
    render(<LiquidButton loading>Save changes</LiquidButton>);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  });
});
