import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { savePdfInApp } from "@/lib/pdf";

function stubMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn(() => ({
    matches,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  })) as unknown as typeof window.matchMedia;
}

describe("savePdfInApp", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("%PDF", { headers: { "Content-Type": "application/pdf" } })),
    );
    URL.createObjectURL = vi.fn(() => "blob:pdf");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("speichert die PDF als Datei (Android & Co.)", async () => {
    stubMatchMedia(false);
    const saved: string[] = [];
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) saved.push(this.download);
    };

    await savePdfInApp("/pdf/zeit-fuer-dich-begleitimpuls.pdf");

    HTMLAnchorElement.prototype.click = originalClick;
    expect(saved).toEqual(["zeit-fuer-dich-begleitimpuls.pdf"]);
  });

  it("bietet die PDF auf dem iPhone über das Teilen-Menü an", async () => {
    stubMatchMedia(true);
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    });
    const share = vi.fn(async (_options?: { files?: File[]; title?: string }) => {});
    Object.defineProperty(window.navigator, "canShare", {
      configurable: true,
      value: () => true,
    });
    Object.defineProperty(window.navigator, "share", { configurable: true, value: share });

    await savePdfInApp("/pdf/app.pdf");

    expect(share).toHaveBeenCalledTimes(1);
    const options = share.mock.calls[0]?.[0];
    expect(options?.files?.[0]?.name).toBe("app.pdf");
    expect(options?.files?.[0]?.type).toBe("application/pdf");
  });
});
