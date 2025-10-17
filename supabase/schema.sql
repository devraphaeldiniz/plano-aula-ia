CREATE TABLE planos_aula (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  disciplina TEXT NOT NULL,
  ano_escolar TEXT NOT NULL,
  tema TEXT NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  introducao_ludica TEXT NOT NULL,
  objetivo_bncc TEXT NOT NULL,
  passo_a_passo JSONB NOT NULL,
  rubrica_avaliacao JSONB NOT NULL
);

CREATE INDEX idx_planos_disciplina ON planos_aula(disciplina);
CREATE INDEX idx_planos_ano ON planos_aula(ano_escolar);
CREATE INDEX idx_planos_created ON planos_aula(created_at DESC);