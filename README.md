# Contract Analyzer

AI-powered tool dat Nederlandse contracten analyseert. Upload een PDF en ontvang direct een juridische analyse met risicoscore, clausulechecklist, geïdentificeerde risico's en concrete aanbevelingen — aangedreven door de Anthropic Claude API.

## Wat doet de app

- **PDF upload** via drag & drop of bestandskiezer
- **Contracttype detectie** (NDA, SLA, huurcontract, etc.)
- **Risicoscore** van 0–100 met kleurcodering
- **Clausulechecklist** — welke standaardclausules zijn aanwezig of ontbreken
- **Risico's** per ernst: hoog / middel / laag
- **Aanbevelingen** voor opvolging
- **3 demo-contracten** om direct te testen zonder PDF

## Projectstructuur

```
contract analyzer/
├── web/                  # Next.js 14 applicatie (App Router)
│   ├── app/
│   │   ├── api/analyze/  # POST endpoint — analyseert contract via Anthropic API
│   │   ├── layout.tsx
│   │   └── page.tsx      # Volledige UI-flow (upload → loading → resultaten → fout)
│   └── components/
│       ├── Header.tsx
│       ├── UploadZone.tsx
│       └── AnalysisResults.tsx
├── tools/                # WAT framework — Python scripts (toekomstig gebruik)
├── workflows/            # WAT framework — Markdown SOPs
├── .tmp/                 # Tijdelijke bestanden (gitignored)
└── .env                  # API keys (gitignored)
```

## Lokaal draaien

### 1. Vereisten

- Node.js 18 of hoger
- Een [Anthropic API key](https://console.anthropic.com/)

### 2. API key instellen

Bewerk het bestand `.env` in de projectroot:

```
ANTHROPIC_API_KEY=sk-ant-...jouw-echte-key...
```

### 3. Dependencies installeren

```bash
cd web
npm install
```

### 4. Development server starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Deployen naar Vercel

1. Push je repository naar GitHub (zorg dat `.env` **niet** is meegenomen — staat al in `.gitignore`)
2. Ga naar [vercel.com](https://vercel.com) en importeer het repository
3. Stel de **Root Directory** in op `web` (Vercel detecteert anders de verkeerde map)
4. Voeg een environment variable toe:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** jouw Anthropic API key
5. Klik **Deploy**

Vercel detecteert Next.js automatisch en bouwt de app zonder verdere configuratie.

## Technische stack

| Onderdeel | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Taal | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Architectuur | WAT framework (Workflows, Agents, Tools) |
