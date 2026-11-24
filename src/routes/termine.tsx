// =======================================================
// ROUTE: TERMINE „ZEIT FÜR DICH.“ (Test, noch nicht verlinkt)
// • Öffentlich: nur Termine mit Status „Öffentlich“
// • Nach dem Redaktions-Login: alle Termine, inkl. Entwürfe,
//   anlegen / bearbeiten / löschen direkt auf dieser Seite
// • Daten: src/lib/termine.ts (Netlify Blobs)
// =======================================================

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { abmelden, anmelden, holeTermine, loescheTermin, speichereTermin } from "@/lib/termine";
import { LEERER_TERMIN, datumLang, type Termin } from "@/lib/termine-types";

export const Route = createFileRoute("/termine")({
  head: () => ({
    meta: [
      { title: "ZEIT FÜR DICH. – Termine | KLARTeXt." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => holeTermine(),
  component: TerminSeite,
});

function TerminSeite() {
  const { angemeldet, termine } = Route.useLoaderData();
  const router = useRouter();
  const [bearbeite, setBearbeite] = useState<Termin | Omit<Termin, "id"> | null>(null);
  const [zeigeLogin, setZeigeLogin] = useState(false);
  const neu = () => router.invalidate();

  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <main id="inhalt" className="min-h-screen bg-background font-body text-foreground">
        <SiteHeader hasScrolled current="/" />

        <section className="overview-hero px-5 pb-10 sm:px-7">
          <div className="mx-auto w-full max-w-[560px]">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              <span className="normal-case">KLARTeXt.</span> in Germering
            </p>
            <h1 className="hero-title mt-3">ZEIT FÜR DICH.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Einmal im Monat ein Abend zum Durchatmen. Hier findest du die nächsten Termine.
            </p>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-7" aria-label="Termine">
          <div className="mx-auto grid w-full max-w-[560px] gap-4">
            {angemeldet ? (
              <div className="termine-redaktion">
                <p className="text-sm font-semibold">Du bist als Redaktion angemeldet.</p>
                <p className="text-sm text-muted-foreground">
                  Entwürfe siehst nur du. Erst mit „Öffentlich“ erscheint ein Termin für alle.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="termine-button termine-button--primary"
                    onClick={() => setBearbeite({ ...LEERER_TERMIN })}
                  >
                    <Plus aria-hidden className="size-4" /> Neuer Termin
                  </button>
                  <button
                    type="button"
                    className="termine-button"
                    onClick={async () => {
                      await abmelden();
                      neu();
                    }}
                  >
                    Abmelden
                  </button>
                </div>
              </div>
            ) : null}

            {bearbeite ? (
              <TerminFormular
                termin={bearbeite}
                onFertig={() => {
                  setBearbeite(null);
                  neu();
                }}
              />
            ) : null}

            {termine.length === 0 ? (
              <p className="termine-leer">Die nächsten Termine werden bald bekannt gegeben.</p>
            ) : (
              termine.map((t) => (
                <article key={t.id} className="termine-karte">
                  {t.status === "entwurf" ? (
                    <p className="termine-badge">Entwurf · nur für die Redaktion sichtbar</p>
                  ) : null}
                  {t.ausgebucht ? (
                    <p className="termine-badge termine-badge--voll">Ausgebucht</p>
                  ) : null}
                  <h2 className="font-display text-2xl font-bold leading-tight">{t.titel}</h2>
                  <ul className="mt-3 grid gap-1.5 text-sm">
                    <li className="flex items-center gap-2">
                      <CalendarDays aria-hidden className="size-4 shrink-0" />
                      {datumLang(t.datum)}
                    </li>
                    {t.beginn ? (
                      <li className="flex items-center gap-2">
                        <Clock aria-hidden className="size-4 shrink-0" />
                        {t.beginn}
                        {t.ende ? `–${t.ende}` : ""} Uhr
                      </li>
                    ) : null}
                    {t.ort ? (
                      <li className="flex items-center gap-2">
                        <MapPin aria-hidden className="size-4 shrink-0" />
                        {t.ort}
                      </li>
                    ) : null}
                  </ul>
                  {t.text ? (
                    <p className="mt-4 whitespace-pre-line text-base leading-7">{t.text}</p>
                  ) : null}
                  {angemeldet ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="termine-button"
                        onClick={() => setBearbeite(t)}
                      >
                        <Pencil aria-hidden className="size-4" /> Bearbeiten
                      </button>
                      <button
                        type="button"
                        className="termine-button"
                        onClick={async () => {
                          if (!window.confirm(`„${t.titel}“ wirklich löschen?`)) return;
                          await loescheTermin({ data: { id: t.id } });
                          neu();
                        }}
                      >
                        <Trash2 aria-hidden className="size-4" /> Löschen
                      </button>
                    </div>
                  ) : null}
                </article>
              ))
            )}

            {!angemeldet ? (
              zeigeLogin ? (
                <Login onOk={neu} />
              ) : (
                <button
                  type="button"
                  className="termine-login-link"
                  onClick={() => setZeigeLogin(true)}
                >
                  Redaktion
                </button>
              )
            ) : null}
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}

function Login({ onOk }: { onOk: () => void }) {
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  async function senden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLaedt(true);
    const pw = String(new FormData(e.currentTarget).get("passwort") ?? "");
    const r = await anmelden({ data: { passwort: pw } });
    setLaedt(false);
    if (r.ok) onOk();
    else setFehler(r.fehler);
  }

  return (
    <form className="termine-karte" onSubmit={senden}>
      <h2 className="font-display text-xl font-bold">Redaktion anmelden</h2>
      <label className="termine-feld">
        Passwort
        <input name="passwort" type="password" autoComplete="current-password" required />
      </label>
      {fehler ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-wine">
          {fehler}
        </p>
      ) : null}
      <button
        type="submit"
        className="termine-button termine-button--primary mt-4"
        disabled={laedt}
      >
        {laedt ? "Einen Moment …" : "Anmelden"}
      </button>
    </form>
  );
}

function TerminFormular({
  termin,
  onFertig,
}: {
  termin: Termin | Omit<Termin, "id">;
  onFertig: () => void;
}) {
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  async function senden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLaedt(true);
    try {
      await speichereTermin({
        data: {
          id: "id" in termin ? termin.id : "",
          datum: String(f.get("datum") ?? ""),
          beginn: String(f.get("beginn") ?? ""),
          ende: String(f.get("ende") ?? ""),
          titel: String(f.get("titel") ?? ""),
          text: String(f.get("text") ?? ""),
          ort: String(f.get("ort") ?? ""),
          ausgebucht: f.get("ausgebucht") === "on",
          status: f.get("status") === "oeffentlich" ? "oeffentlich" : "entwurf",
        },
      });
      onFertig();
    } catch (err) {
      setFehler(err instanceof Error ? err.message : "Speichern hat nicht geklappt.");
    } finally {
      setLaedt(false);
    }
  }

  return (
    <form className="termine-karte termine-karte--formular" onSubmit={senden}>
      <h2 className="font-display text-xl font-bold">
        {"id" in termin ? "Termin bearbeiten" : "Neuer Termin"}
      </h2>
      <label className="termine-feld">
        Titel
        <input
          name="titel"
          defaultValue={termin.titel}
          required
          placeholder="z. B. Einfach mal durchatmen"
        />
      </label>
      <label className="termine-feld">
        Datum
        <input name="datum" type="date" defaultValue={termin.datum} required />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="termine-feld">
          Beginn
          <input name="beginn" type="time" defaultValue={termin.beginn} />
        </label>
        <label className="termine-feld">
          Ende
          <input name="ende" type="time" defaultValue={termin.ende} />
        </label>
      </div>
      <label className="termine-feld">
        Ort
        <input name="ort" defaultValue={termin.ort} placeholder="Adresse" />
      </label>
      <label className="termine-feld">
        Beschreibung
        <textarea name="text" rows={5} defaultValue={termin.text} />
      </label>
      <label className="termine-check">
        <input name="ausgebucht" type="checkbox" defaultChecked={termin.ausgebucht} />
        Ausgebucht
      </label>
      <fieldset className="termine-feld">
        <legend>Sichtbarkeit</legend>
        <label className="termine-check">
          <input
            name="status"
            type="radio"
            value="entwurf"
            defaultChecked={termin.status !== "oeffentlich"}
          />
          Entwurf (nur Redaktion)
        </label>
        <label className="termine-check">
          <input
            name="status"
            type="radio"
            value="oeffentlich"
            defaultChecked={termin.status === "oeffentlich"}
          />
          Öffentlich
        </label>
      </fieldset>
      {fehler ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-wine">
          {fehler}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" className="termine-button termine-button--primary" disabled={laedt}>
          {laedt ? "Speichert …" : "Speichern"}
        </button>
        <button type="button" className="termine-button" onClick={onFertig}>
          Abbrechen
        </button>
      </div>
    </form>
  );
}
