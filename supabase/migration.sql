CREATE TABLE lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  disciplina TEXT NOT NULL,
  ano_escolar TEXT NOT NULL,
  tema TEXT NOT NULL,
  duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos BETWEEN 10 AND 300),
  nivel_turma TEXT NOT NULL CHECK (nivel_turma IN ('inicial', 'intermediario', 'avancado')),
  input_data JSONB NOT NULL,
  plano_gerado JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lesson_plans_user ON lesson_plans(user_id);
CREATE INDEX idx_lesson_plans_disciplina ON lesson_plans(disciplina);
CREATE INDEX idx_lesson_plans_ano ON lesson_plans(ano_escolar);
CREATE INDEX idx_lesson_plans_created ON lesson_plans(created_at DESC);

ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own plans" 
  ON lesson_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own plans" 
  ON lesson_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own plans" 
  ON lesson_plans FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own plans" 
  ON lesson_plans FOR DELETE 
  USING (auth.uid() = user_id);

CREATE TABLE prompts_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  input_json JSONB NOT NULL,
  output_json JSONB,
  model TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prompts_log_user ON prompts_log(user_id);
CREATE INDEX idx_prompts_log_created ON prompts_log(created_at DESC);

ALTER TABLE prompts_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own logs" 
  ON prompts_log FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System insert logs" 
  ON prompts_log FOR INSERT 
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lesson_plans_updated_at
  BEFORE UPDATE ON lesson_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();