export type TerminStatus = "entwurf" | "oeffentlich";

export type Termin = {
  id: string;
  /** YYYY-MM-DD */
  datum: string;
  /** HH:MM */
  beginn: string;
  ende: string;
  titel: string;
  text: string;
  ort: string;
  ausgebucht: boolean;
  status: TerminStatus;
};

export const LEERER_TERMIN: Omit<Termin, "id"> = {
  datum: "",
  beginn: "18:00",
  ende: "20:00",
  titel: "",
  text: "",
  ort: "",
  ausgebucht: false,
  status: "entwurf",
};

export function sortiereTermine(termine: Termin[]) {
  return [...termine].sort((a, b) =>
    `${a.datum}${a.beginn}`.localeCompare(`${b.datum}${b.beginn}`),
  );
}

const MONATE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

/** „Dienstag, 19. Januar 2027“ – ohne Zeitzonen-Verschiebung */
export function datumLang(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const wochentag = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("de-DE", {
    weekday: "long",
    timeZone: "UTC",
  });
  return `${wochentag}, ${d}. ${MONATE[m - 1]} ${y}`;
}
