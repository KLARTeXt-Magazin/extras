import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Issue } from "@/lib/issues";
import { useIssueVisible } from "@/lib/preview";

const hidden: Issue = { eyebrow: "Ausgabe 99", title: "Test", subtitle: "", isPublic: false };
const visible: Issue = { ...hidden, isPublic: true };

// Rendert den Hook einmal und gibt das Ergebnis nach dem Effekt zurück.
function visibleFor(issue: Issue, url: string) {
  window.history.replaceState(null, "", url);
  let result = false;
  function Probe() {
    result = useIssueVisible(issue);
    return null;
  }
  const root = createRoot(document.createElement("div"));
  act(() => root.render(<Probe />));
  act(() => root.unmount());
  return result;
}

describe("Ausgaben ohne isPublic", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    window.sessionStorage.clear();
  });

  it("bleiben auf der Live-Seite verborgen", () => {
    vi.stubEnv("DEV", false);
    expect(visibleFor(hidden, "/lichtblicke")).toBe(false);
    expect(visibleFor(visible, "/lichtblicke")).toBe(true);
  });

  it("erscheinen mit ?vorschau und bleiben für den Tab sichtbar", () => {
    vi.stubEnv("DEV", false);
    expect(visibleFor(hidden, "/lichtblicke?vorschau")).toBe(true);
    expect(visibleFor(hidden, "/")).toBe(true);
    expect(visibleFor(hidden, "/?vorschau=aus")).toBe(false);
  });

  it("sind im Entwicklungsmodus (Lovable, lokal) immer sichtbar", () => {
    vi.stubEnv("DEV", true);
    expect(visibleFor(hidden, "/lichtblicke")).toBe(true);
  });
});
