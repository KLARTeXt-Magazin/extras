import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches the overview page for /", () => {
    const router = createRouter({ routeTree });

    expect(router.matchRoutes("/").at(-1)?.routeId).toBe("/");
  });

  it("matches the Lichtblicke page for /lichtblicke", () => {
    const router = createRouter({ routeTree });

    expect(router.matchRoutes("/lichtblicke").at(-1)?.routeId).toBe("/lichtblicke");
  });

  it("matches Ausgabe 01 for /ehrlichkeit and the events page for /events", () => {
    const router = createRouter({ routeTree });

    expect(router.matchRoutes("/ehrlichkeit").at(-1)?.routeId).toBe("/ehrlichkeit");
    expect(router.matchRoutes("/events").at(-1)?.routeId).toBe("/events");
  });
});
