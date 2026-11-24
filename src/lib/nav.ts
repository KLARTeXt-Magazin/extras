// Gemeinsamer Zustand der Navigation (untere Leiste + Desktop-Kopf)

import { useRouterState } from "@tanstack/react-router";

import { issues, latestIssue } from "@/lib/issues";
import { usePreview } from "@/lib/preview";

// Welcher Punkt ist aktiv?
// • „Start“ nur auf der Startseite
// • „Ausgaben“ auf jeder Ausgabenseite (neueste UND ältere)
//   - neueste Ausgabe: der Link führt genau hierher → aria-current="page"
//   - ältere Ausgabe: man ist im Bereich Ausgaben → aria-current="true"
export function useNavState() {
  const preview = usePreview();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const latest = latestIssue(preview);
  const isLatest = Boolean(latest?.to && latest.to === pathname);
  const isIssue = issues.some((issue) => issue.to === pathname);
  const issuesCurrent: "page" | "true" | undefined = isLatest
    ? "page"
    : isIssue
      ? "true"
      : undefined;
  return { latest, isIssue, issuesCurrent, isStart: pathname === "/" };
}
