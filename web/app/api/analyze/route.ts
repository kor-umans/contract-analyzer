import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Je bent een gespecialiseerde juridische AI-assistent die Nederlandse contracten analyseert.

Analyseer het aangeleverde contract en geef een uitgebreide analyse terug als valide JSON (geen markdown, geen uitleg buiten JSON).

De JSON moet exact dit formaat hebben:
{
  "type": "<contracttype, bijv. 'Huurovereenkomst', 'Arbeidscontract', 'Samenwerkingsovereenkomst'>",
  "risicoscore": <getal van 0 t/m 100, waarbij 0 = geen risico en 100 = zeer hoog risico>,
  "samenvatting": "<korte Nederlandse samenvatting van het contract in 2-4 zinnen>",
  "risicos": [
    {
      "titel": "<korte risicotitel>",
      "beschrijving": "<uitleg van het risico>",
      "ernst": "hoog" | "middel" | "laag"
    }
  ],
  "clausules": [
    {
      "naam": "<clausulenaam>",
      "aanwezig": true | false,
      "toelichting": "<korte uitleg over de clausule of de afwezigheid ervan>"
    }
  ],
  "stats": {
    "partijen": <aantal betrokken partijen als getal>,
    "looptijd": "<duur of einddatum van het contract, bijv. '1 jaar', 'onbepaalde tijd'>",
    "clausules_totaal": <totaal aantal geïdentificeerde clausules als getal>
  },
  "aanbevelingen": [
    "<concrete aanbeveling 1>",
    "<concrete aanbeveling 2>"
  ]
}

Controleer altijd op de volgende standaardclausules: aansprakelijkheidsbeperking, opzegtermijn, geheimhouding, boeteclausule, geschillenbeslechting, overmacht, intellectueel eigendom, privacy/AVG.

Geef altijd valide JSON terug zonder extra tekst.`;

function extractJson(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1];
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdf, text, filename } = body as {
      pdf?: string;
      text?: string;
      filename?: string;
    };

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "Veld 'filename' is verplicht." },
        { status: 400 }
      );
    }

    if (!pdf && !text) {
      return NextResponse.json(
        { error: "Veld 'pdf' (base64) of 'text' is verplicht." },
        { status: 400 }
      );
    }

    const userContent: Anthropic.MessageParam["content"] = pdf
      ? [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: pdf },
            title: filename,
          } as Anthropic.DocumentBlockParam,
          {
            type: "text",
            text: `Analyseer dit contract ("${filename}") en geef de volledige JSON-analyse terug.`,
          },
        ]
      : [
          {
            type: "text",
            text: `Analyseer het volgende contract ("${filename}") en geef de volledige JSON-analyse terug.\n\n${text}`,
          },
        ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userContent }],
    });

    const rawContent = response.content[0];
    if (rawContent.type !== "text") {
      return NextResponse.json(
        { error: "Onverwacht antwoordformaat van de AI." },
        { status: 500 }
      );
    }

    const jsonText = extractJson(rawContent.text);

    let analysis: unknown;
    try {
      analysis = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        {
          error: "Kon de AI-respons niet verwerken als JSON.",
          raw: rawContent.text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API fout: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Ongeldig JSON-formaat in het verzoek." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Er is een onverwachte fout opgetreden." },
      { status: 500 }
    );
  }
}
