# Gerador de Planos de Aula com IA

Sistema para criar planos de aula personalizados usando Gemini API e Supabase.

## 🔗 Links

- **Aplicação**: https://plano-aula-4i0xhojbb-raphaels-projects-004b90a9.vercel.app
- **Repositório**: https://github.com/devraphaeldiniz/plano-aula-ia
- **Supabase**: https://supabase.com/dashboard/project/eolknabdrbasdvqswljf

## 📚 Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL)
- Google Gemini API (gemini-2.5-flash)
- Tailwind CSS
- Zod (validação)

## 🎯 Funcionalidades

- ✅ Formulário com validação dupla (front + back)
- ✅ Geração de plano via IA com retry automático
- ✅ Salvamento persistente no Supabase
- ✅ Exibição formatada com 4 seções:
  - Introdução lúdica
  - Objetivos BNCC
  - Passo a passo detalhado
  - Rubrica de avaliação
- ✅ Tratamento de erros robusto

## 🚀 Setup Local

### Pré-requisitos

- Node.js 18+
- Conta Supabase (gratuita)
- API Key do Google AI Studio (gratuita)

### Instalação
```bash
git clone https://github.com/devraphaeldiniz/plano-aula-ia
cd plano-aula-ia
npm install
```

### Variáveis de Ambiente

Crie `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
GEMINI_API_KEY=sua_gemini_key
```

### Configurar Banco de Dados

1. Acesse seu projeto no Supabase
2. Execute o SQL em `supabase/migration.sql`

### Executar
```bash
npm run dev
```

Acesse http://localhost:3000

## 📊 Modelagem de Dados

### Tabela `lesson_plans`
```sql
lesson_plans (
  id uuid PRIMARY KEY,
  user_id uuid NULLABLE,
  disciplina text,
  ano_escolar text,
  tema text,
  duracao_minutos int,
  nivel_turma text,
  input_data jsonb,
  plano_gerado jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
```

**Decisões:**
- `input_data`: JSONB para flexibilidade de campos opcionais
- `plano_gerado`: JSONB para estrutura complexa (arrays, objetos aninhados)
- `user_id NULL`: permite uso anônimo (auth futuro)
- Índices em: `user_id`, `disciplina`, `created_at`

### Diagrama
```
lesson_plans
├── id (PK)
├── user_id (FK → auth.users, nullable)
├── input_data (jsonb)
│   ├── disciplina
│   ├── anoEscolar
│   ├── tema
│   ├── duracaoMinutos
│   ├── nivelTurma
│   ├── objetivosBncc[]
│   ├── recursosDisponiveis[]
│   ├── metodologiaPreferida
│   └── observacoesAdicionais
└── plano_gerado (jsonb)
    ├── introducao_ludica
    ├── objetivos_bncc[]
    ├── passo_a_passo[]
    │   ├── etapa
    │   └── acao
    ├── rubrica_avaliacao[]
    │   ├── criterio
    │   ├── inicio
    │   ├── em_desenvolvimento
    │   └── proficiente
    └── observacoes
```

## 🤖 Escolha do Modelo

Ver documentação completa em [MODELO.md](./MODELO.md).

**Modelo:** gemini-2.5-flash
**Justificativa:** Equilibra velocidade, qualidade e custo zero, ideal para MVP.

## 🛠️ Decisões Técnicas

### Validação
- Zod para schemas tipados
- Validação client-side (UX)
- Validação server-side (segurança)

### Retry Automático
- Primeira tentativa: temperature 0.8
- Retry: temperature 0.3 + prompt mais restritivo
- Limpeza de markdown no JSON

### Segurança
- API Key apenas server-side (não exposta no client)
- RLS policies no Supabase (preparado para auth)
- Sanitização de inputs via Zod

### Performance
- Gemini Flash (latência ~2-5s)
- JSON nativo (sem parsing complexo)
- Índices otimizados no DB

## 🚧 Desafios Encontrados

### 1. Modelo Gemini não encontrado
**Problema:** API retornava 404 para `gemini-1.5-flash-latest`
**Causa:** Modelo descontinuado/renomeado
**Solução:** 
- Listei modelos disponíveis via `/v1/models`
- Migrei para `gemini-2.5-flash`

### 2. JSON envolvido em markdown
**Problema:** Gemini retornava:
{...}
```
```
**Solução:** Função `cleanJsonResponse()` para strip de delimitadores

### 3. RLS Policy bloqueando INSERT
**Problema:** Supabase rejeitava `INSERT` com `user_id NULL`
**Causa:** Policy exigia `auth.uid() = user_id`
**Solução:** Policy permitindo `user_id IS NULL` para uso anônimo

### 4. Validação de schema inconsistente
**Problema:** IA variava estrutura do JSON
**Solução:** 
- Schema Zod rígido
- Retry com prompt mais restritivo
- Temperature reduzida no retry

### 5. Encoding no Windows (curl)
**Problema:** Acentos apareciam como ` ` no curl
**Causa:** Encoding UTF-8 vs Windows-1252
**Solução:** Problema apenas visual no terminal, app funciona corretamente

## 🔄 Deploy

### Vercel (atual)
```bash
npm install -g vercel
vercel login
vercel
```

Configure env vars no dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

### Alternativas

**Render:**
- Build: `npm run build`
- Start: `npm start`
- Port: 3000

**Fly.io:**
- Dockerfile ou buildpack Node.js
- Env vars via `fly secrets`

## 📝 Limitações Atuais

- ❌ Sem autenticação (todos planos públicos)
- ❌ Sem listagem de planos salvos
- ❌ Sem edição pós-geração
- ❌ Sem exportação PDF/Word
- ⚠️ Rate limit Gemini: 15 req/min (tier gratuito)

## 🎯 Próximos Passos

- [ ] Implementar Supabase Auth
- [ ] Página de histórico de planos
- [ ] Edição inline de planos gerados
- [ ] Export para PDF/DOCX
- [ ] Compartilhamento via link público
- [ ] Templates customizáveis
- [ ] Integração Google Classroom

## 📄 Licença

MIT

## 👤 Autor

**Raphael Diniz**

- GitHub: [@devraphaeldiniz](https://github.com/devraphaeldiniz)
- LinkedIn: [devraphaeldiniz](https://www.linkedin.com/in/devraphaeldiniz/)
- WhatsApp: +55 11 93282-9486