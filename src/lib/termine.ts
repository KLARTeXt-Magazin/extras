// Server-Funktionen für die Terminseite „ZEIT FÜR DICH.“ und den Redaktions-Login.
// Passwort: Umgebungsvariable REDAKTION_PASSWORT (in Netlify unter
// Project configuration → Environment variables). Lokal ohne Variable: „test“.
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { sortiereTermine, type Termin } from "./termine-types";

const COOKIE = "klartext_redaktion";
const LAUFZEIT_S = 60 * 60 * 24 * 30; // 30 Tage angemeldet bleiben

function passwort(): string | undefined {
  const pw = process.env["REDAKTION_PASSWORT"];
  if (pw) return pw;
  return process.env["NODE_ENV"] === "production" ? undefined : "test";
}

async function signatur(text: string, geheim: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(geheim),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function gleich(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function istAngemeldet() {
  const pw = passwort();
  const wert = getCookie(COOKIE);
  if (!pw || !wert) return false;
  const [ablauf, sig] = wert.split(".");
  if (!ablauf || !sig || Number(ablauf) < Date.now() / 1000) return false;
  return gleich(sig, await signatur(`redaktion:${ablauf}`, pw));
}

async function store() {
  return import("./termine-store.server");
}

export const holeTermine = createServerFn({ method: "GET" }).handler(async () => {
  const angemeldet = await istAngemeldet();
  const alle = sortiereTermine(await (await store()).ladeTermine());
  return {
    angemeldet,
    termine: angemeldet ? alle : alle.filter((t) => t.status === "oeffentlich"),
  };
});

export const anmelden = createServerFn({ method: "POST" })
  .validator((d: { passwort: string }) => ({ passwort: String(d?.passwort ?? "") }))
  .handler(async ({ data }) => {
    const pw = passwort();
    if (!pw) return { ok: false, fehler: "Das Passwort ist noch nicht eingerichtet." };
    if (!gleich(data.passwort, pw)) {
      await new Promise((r) => setTimeout(r, 800));
      return { ok: false, fehler: "Das Passwort stimmt nicht." };
    }
    const ablauf = Math.floor(Date.now() / 1000) + LAUFZEIT_S;
    setCookie(COOKIE, `${ablauf}.${await signatur(`redaktion:${ablauf}`, pw)}`, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      path: "/",
      maxAge: LAUFZEIT_S,
    });
    return { ok: true, fehler: "" };
  });

export const abmelden = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});

function bereinige(t: Partial<Termin>): Termin {
  const s = (v: unknown, max = 2000) => String(v ?? "").slice(0, max);
  return {
    id: s(t.id, 40) || crypto.randomUUID(),
    datum: /^\d{4}-\d{2}-\d{2}$/.test(s(t.datum)) ? s(t.datum) : "",
    beginn: /^\d{2}:\d{2}$/.test(s(t.beginn)) ? s(t.beginn) : "",
    ende: /^\d{2}:\d{2}$/.test(s(t.ende)) ? s(t.ende) : "",
    titel: s(t.titel, 200).trim(),
    text: s(t.text, 4000).trim(),
    ort: s(t.ort, 300).trim(),
    ausgebucht: Boolean(t.ausgebucht),
    status: t.status === "oeffentlich" ? "oeffentlich" : "entwurf",
  };
}

export const speichereTermin = createServerFn({ method: "POST" })
  .validator((d: Partial<Termin>) => bereinige(d))
  .handler(async ({ data }) => {
    if (!(await istAngemeldet())) throw new Error("Bitte zuerst anmelden.");
    if (!data.datum || !data.titel) throw new Error("Datum und Titel fehlen.");
    const s = await store();
    const liste = await s.ladeTermine();
    const i = liste.findIndex((t) => t.id === data.id);
    if (i >= 0) liste[i] = data;
    else liste.push(data);
    await s.speichereTermine(liste);
    return data;
  });

export const loescheTermin = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => ({ id: String(d?.id ?? "") }))
  .handler(async ({ data }) => {
    if (!(await istAngemeldet())) throw new Error("Bitte zuerst anmelden.");
    const s = await store();
    await s.speichereTermine((await s.ladeTermine()).filter((t) => t.id !== data.id));
    return { ok: true };
  });
