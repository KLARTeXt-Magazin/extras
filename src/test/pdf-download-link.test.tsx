import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PdfDownloadLink } from "@/components/pdf-download-link";

// Steuert, ob die Seite als installierte App gilt
function setStandalone(standalone: boolean) {
  Object.defineProperty(window.navigator, "standalone", {
    configurable: true,
    value: standalone,
  });
}

describe("PdfDownloadLink", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(new Blob(["%PDF"], { type: "application/pdf" }))),
    );
    URL.createObjectURL = vi.fn(() => "blob:pdf");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    setStandalone(false);
  });

  const render = (href: string) =>
    act(() => {
      root.render(<PdfDownloadLink href={href}>PDF</PdfDownloadLink>);
    });

  const click = () => {
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    act(() => {
      container.querySelector("a[href]")?.dispatchEvent(event);
    });
    return event;
  };

  it("öffnet das PDF im Browser wie gewohnt in einem neuen Tab", () => {
    setStandalone(false);
    render("/pdf/browser.pdf");

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(click().defaultPrevented).toBe(false);
  });

  it("bleibt in der App und speichert das PDF als Datei", async () => {
    setStandalone(true);
    const saved: string[] = [];
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) saved.push(this.download);
    };

    render("/pdf/app.pdf");
    expect(click().defaultPrevented).toBe(true);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    HTMLAnchorElement.prototype.click = originalClick;
    expect(saved).toEqual(["app.pdf"]);
  });
});
