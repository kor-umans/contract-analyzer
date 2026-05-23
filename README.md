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

---

## Installatie (stap voor stap)

### Vereisten

| Tool | Versie | Download |
|---|---|---|
| Node.js | 18 LTS of hoger | [nodejs.org](https://nodejs.org) |
| Git | Willekeurig | [git-scm.com](https://git-scm.com) |
| Anthropic API key | — | [console.anthropic.com](https://console.anthropic.com) |

### Stap 1 — Repository klonen

```bash
git clone https://github.com/kor-umans/contract-analyzer.git
cd contract-analyzer
```

### Stap 2 — API key instellen

Kopieer het voorbeeld-bestand en vul je echte sleutel in:

```bash
cp .env.example .env
```

Open `.env` en vervang de placeholder:

```
ANTHROPIC_API_KEY=sk-ant-...jouw-echte-sleutel...
```

Haal een API key op via [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

> **Let op:** `.env` staat in `.gitignore` en wordt nooit naar GitHub gepusht.

### Stap 3 — Dependencies installeren

```bash
cd web
npm install
```

### Stap 4 — Development server starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser. De app is klaar wanneer je ziet:

```
▲ Next.js 14.x
- Local: http://localhost:3000
```

---

## Deployen naar Vercel

### Optie A — Via Vercel dashboard (aanbevolen)

1. Ga naar **[vercel.com/new](https://vercel.com/new)** en log in met GitHub
2. Klik **Import** naast `contract-analyzer`
3. Stel bij **Configure Project** in:
   - **Root Directory:** `web`
   - **Framework Preset:** Next.js (automatisch gedetecteerd)
4. Voeg een **Environment Variable** toe:
   - Name: `ANTHROPIC_API_KEY`
   - Value: jouw Anthropic API key
5. Klik **Deploy** — klaar (~2 minuten)

### Optie B — Via Vercel CLI

```bash
# Installeer Vercel CLI
npm install -g vercel

# Deploy vanuit de web/ map
cd web
vercel --yes
```

Vercel vraagt je in te loggen via de browser, configureert het project automatisch en geeft je een live URL.

---

## Projectstructuur

```
contract-analyzer/
├── web/                        # Next.js 14 applicatie (App Router)
│   ├── app/
│   │   ├── api/analyze/        # POST /api/analyze — analyseert contract via Claude
│   │   ├── layout.tsx          # Root layout met persistente header
│   │   └── page.tsx            # Upload → loading → resultaten → fout
│   ├── components/
│   │   ├── Header.tsx          # Sticky navigatiebalk
│   │   ├── UploadZone.tsx      # Drag & drop PDF upload
│   │   └── AnalysisResults.tsx # Weergave van de analyse
│   └── vercel.json             # Vercel buildconfiguratie (root dir = web/)
├── tools/                      # WAT framework — Python scripts
├── workflows/                  # WAT framework — Markdown SOPs
├── .tmp/                       # Tijdelijke bestanden (gitignored)
├── .env                        # API keys (gitignored — maak zelf aan via .env.example)
├── .env.example                # Template voor .env
└── vercel.json                 # Vercel buildconfiguratie (root dir = repo root)
```

---

## Technische stack

| Onderdeel | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Taal | TypeScript |
| Styling | Tailwind CSS + Geist font |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Architectuur | WAT framework (Workflows, Agents, Tools) |

## Beveiliging

- API keys staan **alleen** in `.env` (gitignored) en als environment variable in Vercel
- Contracten worden niet opgeslagen — elke analyse is stateless
- De Anthropic API key is nooit zichtbaar aan de client (server-only route)
