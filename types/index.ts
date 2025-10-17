import { z } from 'zod';

export const PlanoAulaInputSchema = z.object({
  disciplina: z.string().min(2),
  anoEscolar: z.string().min(2),
  tema: z.string().min(3),
  duracaoMinutos: z.number().min(10).max(300),
  nivelTurma: z.enum(['inicial', 'intermediario', 'avancado']),
  objetivosBncc: z.array(z.string()).optional(),
  recursosDisponiveis: z.array(z.string()).optional(),
  metodologiaPreferida: z.string().optional(),
  observacoesAdicionais: z.string().max(500).optional(),
});

export const PlanoAulaOutputSchema = z.object({
  introducao_ludica: z.string(),
  objetivos_bncc: z.array(z.string()),
  passo_a_passo: z.array(z.object({
    etapa: z.number(),
    acao: z.string(),
  })),
  rubrica_avaliacao: z.array(z.object({
    criterio: z.string(),
    inicio: z.string(),
    em_desenvolvimento: z.string(),
    proficiente: z.string(),
  })),
  observacoes: z.string(),
});

export type PlanoAulaInput = z.infer<typeof PlanoAulaInputSchema>;
export type PlanoAulaOutput = z.infer<typeof PlanoAulaOutputSchema>;

export interface LessonPlanDB {
  id: string;
  user_id: string | null;
  disciplina: string;
  ano_escolar: string;
  tema: string;
  duracao_minutos: number;
  nivel_turma: string;
  input_data: PlanoAulaInput;
  plano_gerado: PlanoAulaOutput;
  created_at: string;
  updated_at: string;
}