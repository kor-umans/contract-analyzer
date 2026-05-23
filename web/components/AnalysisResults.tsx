"use client";

import type { ReactNode } from "react";

export interface ContractAnalysis {
  type: string;
  risicoscore: number;
  samenvatting: string;
  risicos: { titel: string; beschrijving: string; ernst: "hoog" | "middel" | "laag" }[];
  clausules: { naam: string; aanwezig: boolean; toelichting: string }[];
  stats: { partijen: number; looptijd: string; clausules_totaal: number };
  aanbevelingen: string[];
}

interface AnalysisResultsProps {
  data: ContractAnalysis;
  filename: string;
  onReset: () => void;
}

// ── Risicoscore helpers ───────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score < 35) return { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", label: "Laag risico" };
  if (score < 65) return { bar: "bg-amber-400",  text: "text-amber-700",   bg: "bg-amber-50",   label: "Gemiddeld risico" };
  return            { bar: "bg-red-500",   text: "text-red-700",    bg: "bg-red-50",    label: "Hoog risico" };
}

// ── Ernst badge ───────────────────────────────────────────────────────────────

const ernstStyles: Record<string, string> = {
  hoog:   "bg-red-100 text-red-700 ring-1 ring-red-200",
  middel: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  laag:   "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

function ErnstBadge({ ernst }: { ernst: "hoog" | "middel" | "laag" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ernstStyles[ernst]}`}>
      {ernst}
    </span>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">{title}</h2>
      {children}
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AnalysisResults({ data, filename, onReset }: AnalysisResultsProps) {
  const score = Math.max(0, Math.min(100, Math.round(data.risicoscore)));
  const sc = scoreColor(score);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm text-neutral-400">{filename}</p>
          <h1 className="mt-0.5 text-2xl font-bold text-neutral-900">{data.type}</h1>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-900"
        >
          Nieuw contract
        </button>
      </div>

      {/* ── Risicoscore ── */}
      <Section title="Risicoscore">
        <div className={`rounded-2xl p-5 ${sc.bg}`}>
          <div className="mb-3 flex items-baseline justify-between">
            <span className={`text-4xl font-bold ${sc.text}`}>{score}</span>
            <span className={`text-sm font-semibold ${sc.text}`}>{sc.label}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${sc.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-neutral-400">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </Section>

      {/* ── Stat cards ── */}
      <Section title="Overzicht">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Partijen", value: data.stats.partijen },
            { label: "Looptijd", value: data.stats.looptijd },
            { label: "Clausules", value: data.stats.clausules_totaal },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-3 sm:p-4 shadow-sm"
            >
              <span className="w-full truncate text-center text-lg font-bold text-neutral-900 sm:text-2xl">
                {value}
              </span>
              <span className="mt-0.5 text-xs text-neutral-400">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Samenvatting ── */}
      <Section title="Samenvatting">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8h.01M12 12v4" />
            </svg>
            <span className="text-xs font-semibold text-blue-600">AI-samenvatting</span>
          </div>
          <p className="text-sm leading-relaxed text-blue-900">{data.samenvatting}</p>
        </div>
      </Section>

      {/* ── Risico's ── */}
      {data.risicos.length > 0 && (
        <Section title={`Risico's (${data.risicos.length})`}>
          <div className="space-y-2">
            {data.risicos.map((r, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-neutral-800">{r.titel}</p>
                  <ErnstBadge ernst={r.ernst} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{r.beschrijving}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Clausules ── */}
      {data.clausules.length > 0 && (
        <Section title="Clausules">
          <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            {data.clausules.map((c, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 shrink-0">
                  {c.aanwezig ? (
                    <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" d="M9 9l6 6M15 9l-6 6" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${c.aanwezig ? "text-neutral-800" : "text-neutral-500"}`}>
                    {c.naam}
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-400">{c.toelichting}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Aanbevelingen ── */}
      {data.aanbevelingen.length > 0 && (
        <Section title="Aanbevelingen">
          <ol className="space-y-2">
            {data.aanbevelingen.map((a, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-3 shadow-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-neutral-700">{a}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* ── Actieknoppen ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onReset}
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
        >
          Nieuw contract analyseren
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-700"
        >
          Rapport opslaan / afdrukken
        </button>
      </div>

    </div>
  );
}
