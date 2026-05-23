"use client";

import { useEffect, useState } from "react";
import UploadZone from "@/components/UploadZone";
import AnalysisResults, { type ContractAnalysis } from "@/components/AnalysisResults";

// ── Types ─────────────────────────────────────────────────────────────────────

type AnalyzeBody = { pdf?: string; text?: string; filename: string };

type AppState =
  | { status: "idle" }
  | { status: "loading"; filename: string }
  | { status: "success"; data: ContractAnalysis; filename: string }
  | { status: "error"; message: string; retryBody: AnalyzeBody };

// ── Loading status carousel ───────────────────────────────────────────────────

const STATUS_TEXTS = [
  "Tekst extraheren...",
  "Clausules identificeren...",
  "Risico's beoordelen...",
  "Partijen analyseren...",
  "Aanbevelingen opstellen...",
];

// ── Demo contracts ────────────────────────────────────────────────────────────

const DEMO_CONTRACTS = {
  nda: {
    filename: "Demo — Non-Disclosure Agreement.txt",
    label: "NDA",
    description: "Geheimhoudingsovereenkomst",
    text: `NON-DISCLOSURE AGREEMENT (NDA)

Partijen:
1. TechCorp B.V., gevestigd te Amsterdam, KvK 12345678 ("Openbarende Partij")
2. InnovatieX B.V., gevestigd te Rotterdam, KvK 87654321 ("Ontvangende Partij")

Artikel 1 – Geheimhouding
De Ontvangende Partij verbindt zich ertoe alle vertrouwelijke informatie die zij ontvangt van de Openbarende Partij strikt geheim te houden en niet aan derden te verstrekken, tenzij vooraf schriftelijk toestemming is verleend.

Artikel 2 – Definitie vertrouwelijke informatie
Onder vertrouwelijke informatie wordt verstaan: alle technische, commerciële en financiële gegevens, waaronder broncode, bedrijfsplannen, klantgegevens en prijslijsten.

Artikel 3 – Duur
Deze overeenkomst treedt in werking op 1 januari 2025 en heeft een looptijd van 3 jaar. Na afloop blijft de geheimhoudingsplicht voor reeds ontvangen informatie van kracht voor onbepaalde tijd.

Artikel 4 – Aansprakelijkheid
Bij schending van deze overeenkomst verbeurt de Ontvangende Partij een onmiddellijk opeisbare boete van € 50.000,- per overtreding, onverminderd het recht van de Openbarende Partij op volledige schadevergoeding.

Artikel 5 – Uitzonderingen
De geheimhoudingsplicht geldt niet voor informatie die: (a) reeds publiekelijk bekend is, (b) door de Ontvangende Partij zelfstandig is ontwikkeld, of (c) verstrekt moet worden op grond van wettelijke verplichtingen.

Artikel 6 – Toepasselijk recht en geschillen
Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter te Amsterdam.

Ondertekend te Amsterdam op 15 januari 2025.`,
  },

  sla: {
    filename: "Demo — Service Level Agreement.txt",
    label: "SLA",
    description: "Dienstverleningsovereenkomst",
    text: `SERVICE LEVEL AGREEMENT (SLA)

Partijen:
1. CloudHosting Nederland B.V., gevestigd te Utrecht ("Dienstverlener")
2. Retail Solutions N.V., gevestigd te Eindhoven ("Klant")

Artikel 1 – Dienstverlening
De Dienstverlener levert hosting- en beheersdiensten voor de webinfrastructuur van de Klant, bestaande uit: managed servers, 24/7 monitoring, en dagelijkse back-ups.

Artikel 2 – Beschikbaarheid
De Dienstverlener garandeert een uptime van minimaal 99,5% per kalendermaand, gemeten op maandbasis. Gepland onderhoud buiten kantoortijden (02:00–06:00 uur) telt niet mee voor de berekening.

Artikel 3 – Reactietijden
- Prioriteit Kritiek (productie down): respons binnen 15 minuten, oplossing binnen 4 uur.
- Prioriteit Hoog: respons binnen 1 uur, oplossing binnen 8 uur.
- Prioriteit Normaal: respons binnen 4 uur, oplossing binnen 3 werkdagen.

Artikel 4 – Boeteclausule
Bij onderschrijding van de gegarandeerde uptime ontvangt de Klant een servicetegoed van 10% van de maandfactuur per volledig procentpunt onder de garantie, met een maximum van 50% van de maandfactuur.

Artikel 5 – Aansprakelijkheidsuitsluiting
De aansprakelijkheid van de Dienstverlener is te allen tijde beperkt tot het bedrag van de factuur over de betreffende maand. Gevolgschade, gederfde winst en indirecte schade zijn uitdrukkelijk uitgesloten.

Artikel 6 – Looptijd en opzegging
Deze overeenkomst geldt voor een initiële periode van 24 maanden vanaf 1 maart 2025. Na afloop wordt de overeenkomst automatisch verlengd met 12 maanden, tenzij een partij uiterlijk 3 maanden voor afloop schriftelijk opzegt.

Artikel 7 – Vertrouwelijkheid
Beide partijen verplichten zich tot geheimhouding van elkaars bedrijfsinformatie gedurende de looptijd en 2 jaar daarna.

Artikel 8 – Toepasselijk recht
Nederlands recht is van toepassing. Geschillen worden beslecht door arbitrage conform de regels van het Nederlands Arbitrage Instituut.`,
  },

  huur: {
    filename: "Demo — Huurovereenkomst Bedrijfsruimte.txt",
    label: "Huurcontract",
    description: "Commerciële bedrijfsruimte",
    text: `HUUROVEREENKOMST BEDRIJFSRUIMTE

Partijen:
1. Vastgoed Holding Amsterdam B.V., gevestigd te Amsterdam, KvK 11223344 ("Verhuurder")
2. StartupX B.V., gevestigd te Amsterdam, KvK 44332211 ("Huurder")

Artikel 1 – Het gehuurde
Verhuurder verhuurt aan Huurder de bedrijfsruimte gelegen aan de Keizersgracht 123, 1015 CJ Amsterdam (5e verdieping, ca. 250 m²).

Artikel 2 – Bestemming
Het gehuurde is bestemd voor gebruik als kantoorruimte. De Huurder is niet gerechtigd het gehuurde voor andere doeleinden te gebruiken zonder voorafgaande schriftelijke toestemming van Verhuurder.

Artikel 3 – Huurprijs en indexatie
De aanvangshuurprijs bedraagt € 6.250,- per maand exclusief BTW, bij vooruitbetaling te voldoen vóór de eerste van de maand. De huurprijs wordt jaarlijks geïndexeerd op basis van de CPI-index, zonder maximum.

Artikel 4 – Huurperiode
De huurovereenkomst gaat in op 1 april 2025 voor een vaste periode van 5 jaar. Tussentijdse opzegging door Huurder is niet mogelijk gedurende de eerste 3 jaar.

Artikel 5 – Waarborgsom
Huurder betaalt bij aanvang een waarborgsom gelijk aan 3 maanden huur (€ 18.750,- exclusief BTW). De waarborgsom wordt niet rentedragend aangehouden.

Artikel 6 – Onderhoud en reparaties
Klein dagelijks onderhoud is voor rekening van Huurder. Structureel onderhoud en herstel van verborgen gebreken zijn voor rekening van Verhuurder, mits Huurder gebreken binnen 5 werkdagen meldt.

Artikel 7 – Verbouwingen
Verbouwingen en aanpassingen door Huurder zijn uitsluitend toegestaan na schriftelijke toestemming van Verhuurder. Bij oplevering dient Huurder het gehuurde terug te brengen in de oorspronkelijke staat, tenzij anders overeengekomen.

Artikel 8 – Aansprakelijkheid
Verhuurder is niet aansprakelijk voor schade als gevolg van gebreken aan het gehuurde, tenzij er sprake is van opzet of grove nalatigheid.

Artikel 9 – Toepasselijk recht
Op deze overeenkomst is Nederlands recht van toepassing (BW Boek 7, titel 4). Geschillen worden voorgelegd aan de Rechtbank Amsterdam.`,
  },
} as const;

type DemoKey = keyof typeof DEMO_CONTRACTS;

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (state.status !== "loading") return;
    setStatusIdx(0);
    const id = setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_TEXTS.length),
      2200
    );
    return () => clearInterval(id);
  }, [state.status]);

  // Plain async function — no useCallback needed; only called on user events.
  // retryBody stored in state so the error UI can call analyze(state.retryBody)
  // without a self-referencing closure.
  async function analyze(body: AnalyzeBody) {
    setState({ status: "loading", filename: body.filename });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { error?: string }).error ?? "Onbekende fout");
      setState({
        status: "success",
        data: json as ContractAnalysis,
        filename: body.filename,
      });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Er is een onverwachte fout opgetreden.",
        retryBody: body,
      });
    }
  }

  function onFile(base64: string, filename: string) {
    void analyze({ pdf: base64, filename });
  }

  function onDemo(key: DemoKey) {
    const { filename, text } = DEMO_CONTRACTS[key];
    void analyze({ text, filename });
  }

  function onReset() {
    setState({ status: "idle" });
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (state.status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
          </div>
          <div>
            <p className="max-w-xs truncate text-xs font-semibold uppercase tracking-widest text-neutral-400">
              {state.filename}
            </p>
            <p className="mt-2 h-7 text-lg font-semibold text-neutral-700">
              {STATUS_TEXTS[statusIdx]}
            </p>
          </div>
          <p className="max-w-xs text-sm text-neutral-400">
            De AI analyseert je contract. Dit duurt gemiddeld 15–30 seconden.
          </p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (state.status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-7 w-7 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Analyse mislukt</h2>
            <p className="mt-1.5 text-sm text-neutral-500">{state.message}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <button
              onClick={onReset}
              className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Terug
            </button>
            <button
              onClick={() => void analyze(state.retryBody)}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  if (state.status === "success") {
    return (
      <div className="flex-1 px-4 py-10 sm:py-14">
        <AnalysisResults
          data={state.data}
          filename={state.filename}
          onReset={onReset}
        />
      </div>
    );
  }

  // ── Idle / upload ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-xl space-y-8">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Analyseer je contract
          </h1>
          <p className="mt-2 text-sm text-neutral-500 sm:text-base">
            Upload een PDF en ontvang direct een juridische analyse — risico&apos;s,
            clausules en aanbevelingen in het Nederlands.
          </p>
        </div>

        {/* Upload zone */}
        <UploadZone onFile={onFile} />

        {/* Demo buttons */}
        <div className="space-y-3">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Of probeer een demo
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(DEMO_CONTRACTS) as [DemoKey, (typeof DEMO_CONTRACTS)[DemoKey]][]).map(
              ([key, { label, description }]) => (
                <button
                  key={key}
                  onClick={() => onDemo(key)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-neutral-200 bg-white px-2 py-4 text-center shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md sm:px-3"
                >
                  <span className="text-sm font-semibold text-neutral-800">{label}</span>
                  <span className="hidden text-xs text-neutral-400 sm:block">{description}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-neutral-400">
          Contracten worden niet opgeslagen. Analyse verloopt via de Anthropic API.
        </p>
      </div>
    </div>
  );
}
