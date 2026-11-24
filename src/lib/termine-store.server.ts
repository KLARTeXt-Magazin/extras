// Speicher für „ZEIT FÜR DICH.“-Termine.
// • Auf Netlify: Netlify Blobs (ein JSON-Eintrag „liste“).
// • Lokal (bun run dev): Datei .data/termine.json.
import type { Termin } from "./termine-types";

// Startdaten (von magazin-klartext.de/zeit-fuer-dich übernommen, als Entwurf).
// Gelten nur, solange noch nichts gespeichert wurde.
const START: Termin[] = [
  {
    id: "2027-01-durchatmen",
    datum: "2027-01-19",
    beginn: "18:00",
    ende: "20:00",
    titel: "Einfach mal durchatmen",
    text: "Was tut mir gut und wie finde ich dafür Platz im Alltag?",
    ort: "Riviera, Bertha-von-Suttner-Straße 5, 82110 Germering",
    ausgebucht: false,
    status: "entwurf",
  },
];

const KEY = "liste";
const LOCAL_FILE = ".data/termine.json";

function isNetlify() {
  return Boolean(
    process.env["NETLIFY"] || process.env["NETLIFY_BLOBS_CONTEXT"] || "Netlify" in globalThis,
  );
}

async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: "termine", consistency: "strong" });
}

export async function ladeTermine(): Promise<Termin[]> {
  if (isNetlify()) {
    const data = (await (await blobStore()).get(KEY, { type: "json" })) as Termin[] | null;
    return data ?? START;
  }
  const fs = await import("node:fs/promises");
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Termin[];
  } catch {
    return START;
  }
}

export async function speichereTermine(termine: Termin[]): Promise<void> {
  if (isNetlify()) {
    await (await blobStore()).setJSON(KEY, termine);
    return;
  }
  const fs = await import("node:fs/promises");
  await fs.mkdir(".data", { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(termine, null, 2));
}
