// Gemeinsamer Zustand der Navigation (untere Leiste + Desktop-Kopf)

import { useRouterState } from "@tanstack/react-router";

import { latestIssue } from "@/lib/issues";
import { usePreview } from "@/lib/preview";

// Welcher Punkt ist aktiv? Ältere Ausgaben gehören zu „Start“.
export function useNavState() {
  const preview = usePreview();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const latest = latestIssue(preview);
  const isLatest = Boolean(latest?.to && latest.to === pathname);
  return { latest, isLatest, isStart: !isLatest };
}
