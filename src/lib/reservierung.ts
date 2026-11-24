// Reservierung für „ZEIT FÜR DICH.“ – wird NICHT gespeichert, nur per Mail verschickt:
// • an die Redaktion (MAIL_AN, sonst SMTP_USER), Antworten gehen direkt an den Gast
// • Bestätigung an den Gast
// Zugangsdaten als Umgebungsvariablen in Netlify:
//   SMTP_HOST (z. B. smtp.ionos.de), SMTP_PORT (587), SMTP_USER, SMTP_PASS, optional MAIL_AN
import { createServerFn } from "@tanstack/react-start";

import { datumLang } from "./termine-types";

export type Reservierung = {
  terminId: string;
  name: string;
  email: string;
  personen: number;
  hinweis: string;
  einwilligung: boolean;
  /** Honeypot: bleibt bei Menschen leer */
  website: string;
};

const env = (k: string) => process.env[k] ?? "";

function bereinige(d: Partial<Reservierung>): Reservierung {
  const s = (v: unknown, max: number) =>
    String(v ?? "")
      .trim()
      .slice(0, max);
  return {
    terminId: s(d.terminId, 60),
    name: s(d.name, 120),
    email: s(d.email, 200),
    personen: Math.min(10, Math.max(1, Math.round(Number(d.personen) || 1))),
    hinweis: s(d.hinweis, 1000),
    einwilligung: d.einwilligung === true,
    website: s(d.website, 200),
  };
}

export const reservieren = createServerFn({ method: "POST" })
  .validator((d: Partial<Reservierung>) => bereinige(d))
  .handler(async ({ data }) => {
    // Bots füllen das versteckte Feld aus – so tun, als hätte es geklappt
    if (data.website) return { ok: true, fehler: "" };
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return { ok: false, fehler: "Bitte gib deinen Namen und eine gültige E-Mail-Adresse an." };
    if (!data.einwilligung)
      return { ok: false, fehler: "Bitte bestätige die Einwilligung zur Datenübermittlung." };

    const { ladeTermine } = await import("./termine-store.server");
    const termin = (await ladeTermine()).find((t) => t.id === data.terminId);
    if (!termin || termin.status !== "oeffentlich")
      return { ok: false, fehler: "Diesen Termin gibt es leider nicht mehr." };
    if (termin.ausgebucht) return { ok: false, fehler: "Dieser Termin ist leider ausgebucht." };

    const wann = `${datumLang(termin.datum)}${termin.beginn ? `, ${termin.beginn}${termin.ende ? `–${termin.ende}` : ""} Uhr` : ""}`;
    const user = env("SMTP_USER");
    const an = env("MAIL_AN") || user;

    if (!env("SMTP_HOST") || !user || !env("SMTP_PASS")) {
      if (env("NODE_ENV") !== "production") {
        console.info("[Reservierung – Test ohne Mailversand]", { termin: termin.titel, ...data });
        return { ok: true, fehler: "" };
      }
      return {
        ok: false,
        fehler:
          "Die Reservierung klappt gerade nicht. Schreib uns bitte an redaktion@magazin-klartext.de.",
      };
    }

    const nodemailer = await import("nodemailer");
    const port = Number(env("SMTP_PORT") || 587);
    const mailer = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port,
      secure: port === 465,
      auth: { user, pass: env("SMTP_PASS") },
    });

    try {
      await mailer.sendMail({
        from: `KLARTeXt. Reservierung <${user}>`,
        to: an,
        replyTo: `${data.name} <${data.email}>`,
        subject: `Reservierung: ${termin.titel} (${datumLang(termin.datum)})`,
        text: [
          `Neue Reservierung für „${termin.titel}“`,
          wann,
          "",
          `Name: ${data.name}`,
          `E-Mail: ${data.email}`,
          `Personen: ${data.personen}`,
          `Hinweis: ${data.hinweis || "–"}`,
          "",
          "Mit „Antworten“ schreibst du direkt an die Person.",
        ].join("\n"),
      });
      await mailer.sendMail({
        from: `KLARTeXt. <${user}>`,
        to: data.email,
        replyTo: an,
        subject: `Dein Platz bei ZEIT FÜR DICH. am ${datumLang(termin.datum)}`,
        text: [
          `Hallo ${data.name},`,
          "",
          `danke für deine Reservierung. Wir haben ${data.personen === 1 ? "einen Platz" : `${data.personen} Plätze`} für dich vorgemerkt:`,
          "",
          `${termin.titel}`,
          wann,
          termin.ort,
          "",
          "Falls du doch nicht kommen kannst, antworte einfach auf diese Mail.",
          "",
          "Wir freuen uns auf dich!",
          "Dein KLARTeXt.-Team",
        ].join("\n"),
      });
    } catch (err) {
      console.error("Reservierung: Mailversand fehlgeschlagen", err);
      return {
        ok: false,
        fehler:
          "Die Reservierung klappt gerade nicht. Schreib uns bitte an redaktion@magazin-klartext.de.",
      };
    }
    return { ok: true, fehler: "" };
  });
