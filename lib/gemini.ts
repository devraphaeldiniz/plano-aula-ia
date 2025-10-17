import { PlanoAulaInput, PlanoAulaOutput, PlanoAulaOutputSchema } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string, retry: boolean = false): Promise<string> {
  const finalPrompt = retry 
    ? `${prompt}\n\nCRÍTICO: Retorne APENAS JSON válido, sem texto adicional, sem markdown, sem explicações.`
    : prompt;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: finalPrompt }] }],
      generationConfig: {
        temperature: retry ? 0.3 : 0.8,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function cleanJsonResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

export async function gerarPlanoAula(input: PlanoAulaInput): Promise<PlanoAulaOutput> {
  const prompt = `[SYSTEM]
Você gera um plano de aula completo e devolve SOMENTE JSON válido. Nada de texto fora do JSON.
Estrutura:
{
  "introducao_ludica": "string",
  "objetivos_bncc": ["string"],
  "passo_a_passo": [
    {"etapa": 1, "acao": "string"},
    {"etapa": 2, "acao": "string"}
  ],
  "rubrica_avaliacao": [
    {"criterio": "string", "inicio": "string", "em_desenvolvimento": "string", "proficiente": "string"}
  ],
  "observacoes": "string"
}
Regras:
- Linguagem simples, natural e profissional.
- Conectar explicitamente as ações aos objetivos BNCC informados.
- Adequar ao nível da turma e duração.
- Sem frases genéricas de IA. Sem justificativas. Apenas conteúdo útil à professora.

[USER]
Gere um plano de aula com os parâmetros:
etapa/ano: ${input.anoEscolar}
disciplina: ${input.disciplina}
tema: ${input.tema}
duração_min: ${input.duracaoMinutos}
recursos: ${input.recursosDisponiveis?.join(', ') || 'não especificados'}
nível_da_turma: ${input.nivelTurma}
objetivos_bncc: ${input.objetivosBncc?.join(', ') || 'não especificados'}
preferências_de_metodologia: ${input.metodologiaPreferida || 'não especificada'}

Responda somente com o JSON na estrutura definida.`;

  let text: string;
  let parsed: any;
  
  try {
    text = await callGemini(prompt);
    text = cleanJsonResponse(text);
    parsed = JSON.parse(text);
  } catch (error) {
    text = await callGemini(prompt, true);
    text = cleanJsonResponse(text);
    parsed = JSON.parse(text);
  }

  return PlanoAulaOutputSchema.parse(parsed);
}