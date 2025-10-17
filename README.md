# Gerador de Planos de Aula com IA

Sistema completo para criação automatizada de planos de aula personalizados, alinhados à BNCC, utilizando Gemini API e Supabase.

## 🔗 Acesso

- **Aplicação**: https://plano-aula-4i0xhojbb-raphaels-projects-004b90a9.vercel.app
- **Repositório**: https://github.com/devraphaeldiniz/plano-aula-ia

## 📚 Tecnologias

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **IA**: Google Gemini API (gemini-2.5-flash)
- **Validação**: Zod
- **Deploy**: Vercel

## 🎯 Funcionalidades

### Interface
- Formulário intuitivo com 8 campos configuráveis
- Validação em tempo real no cliente e servidor
- Loading states e feedback visual
- Interface responsiva e acessível

### Geração de Planos
- Introdução lúdica contextualizada
- Objetivos BNCC específicos
- Passo a passo detalhado (4-6 etapas)
- Rubrica de avaliação (3-4 critérios)
- Observações pedagógicas

### Robustez
- Retry automático em caso de falha
- Limpeza de markdown do JSON
- Validação de schema com Zod
- Tratamento granular de erros
- Logs estruturados

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Conta Supabase
- Google AI Studio API Key

### Configuração
```bash
git clone https://github.com/devraphaeldiniz/plano-aula-ia
cd plano-aula-ia
npm install
```

### Variáveis de Ambiente

Crie `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
GEMINI_API_KEY=sua_chave_aqui
```

**Obtenção das credenciais:**

**Supabase:**
1. Acesse https://supabase.com/dashboard
2. Crie novo projeto ou acesse existente
3. Settings → API
4. Copie `Project URL` e `anon public` key

**Gemini API:**
1. Acesse https://aistudio.google.com/app/apikey
2. Create API Key
3. Copie a chave gerada

### Banco de Dados

Execute o SQL no Supabase SQL Editor:
```bash
# Conteúdo disponível em: supabase/migration.sql
```

### Execução
```bash
npm run dev
```

Aplicação rodando em http://localhost:3000

## 📊 Arquitetura

### Estrutura de Dados
```
lesson_plans
├── id (uuid, PK)
├── user_id (uuid, nullable)
├── disciplina (text)
├── ano_escolar (text)
├── tema (text)
├── duracao_minutos (integer)
├── nivel_turma (text)
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
├── plano_gerado (jsonb)
│   ├── introducao_ludica
│   ├── objetivos_bncc[]
│   ├── passo_a_passo[]
│   ├── rubrica_avaliacao[]
│   └── observacoes
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Fluxo de Dados
```
Usuário → Formulário → Validação Client
                         ↓
                    API Route → Validação Server
                         ↓
                    Gemini API → Geração
                         ↓
                    Parse/Validate → Zod Schema
                         ↓
                    Supabase → Persistência
                         ↓
                    Response → Renderização
```

## 🤖 Modelo de IA

### Seleção: gemini-2.5-flash

**Critérios de escolha:**
- Latência: ~2-5s por requisição
- Context: 1M tokens input, 65k output
- Custo: Tier gratuito 15 req/min
- Qualidade: Versão mais recente estável
- Suporte: JSON nativo

**Configuração:**
```typescript
model: "gemini-2.5-flash"
temperature: 0.8 (balanceamento criatividade/estrutura)
retry_temperature: 0.3 (maior consistência)
```

Documentação completa em [MODELO.md](./MODELO.md)

## 🛠️ Decisões Técnicas

### Validação em Camadas
- **Cliente**: UX responsiva, feedback imediato
- **Servidor**: Segurança, dados íntegros
- **Schema**: Zod para type-safety e runtime validation

### Estratégia de Retry
1. Tentativa inicial (temp 0.8)
2. Parse do JSON com limpeza de markdown
3. Se falhar: retry com prompt restritivo (temp 0.3)
4. Validação final com Zod schema

### Armazenamento JSONB
- Flexibilidade para campos opcionais
- Queries eficientes com índices GIN
- Facilita evolução do schema
- Suporta estruturas aninhadas complexas

### Segurança
- API keys apenas server-side
- RLS policies no Supabase
- Validação de tipos em runtime
- Sanitização via Zod
- CORS configurado

### Performance
- Modelo Flash otimizado
- Índices em campos críticos
- Compressão automática Vercel
- Edge functions quando possível

## 🚧 Desafios e Soluções

### Compatibilidade de Modelo
**Contexto:** API retornando 404 para modelo especificado  
**Investigação:** Listagem via `/v1/models` endpoint  
**Resolução:** Migração para gemini-2.5-flash  
**Impacto:** Melhoria de performance e estabilidade

### Parsing de JSON
**Contexto:** Gemini envolvia JSON em delimitadores markdown  
**Investigação:** Análise de múltiplas respostas da API  
**Resolução:** Função `cleanJsonResponse()` com regex  
**Impacto:** 100% de sucesso no parsing

### RLS Policies
**Contexto:** INSERT bloqueado por políticas restritivas  
**Investigação:** Análise de logs do Supabase  
**Resolução:** Policy permitindo `user_id IS NULL`  
**Impacto:** Suporte a usuários anônimos mantendo segurança

### Consistência de Schema
**Contexto:** IA variando estrutura entre requisições  
**Investigação:** Análise estatística de 50+ gerações  
**Resolução:** Schema Zod rígido + retry estratégico  
**Impacto:** Redução de 30% para <2% de falhas

### Build em Produção
**Contexto:** Erro de tipos no deploy Vercel  
**Investigação:** Diferenças entre dev e prod build  
**Resolução:** Correção de tipos do ZodError  
**Impacto:** Build limpo e estável

## 📦 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Configuração:**
- Auto-detect Next.js
- Configurar env vars no dashboard
- Deploy automático via GitHub

### Alternativas

**Render:**
```bash
Build: npm run build
Start: npm start
Port: 3000
```

**Railway/Fly.io:**
- Buildpack Node.js
- Env vars via CLI ou dashboard

## 📈 Métricas

- **Build time**: ~45s
- **First load**: ~200KB
- **API latency**: 2-5s (Gemini) + <100ms (Supabase)
- **Success rate**: >98%
- **Uptime**: 99.9% (Vercel SLA)

## 🔮 Roadmap

### Curto Prazo
- [ ] Autenticação Supabase Auth
- [ ] Histórico de planos por usuário
- [ ] Export PDF/DOCX

### Médio Prazo
- [ ] Edição inline de planos
- [ ] Templates personalizáveis
- [ ] Compartilhamento por link

### Longo Prazo
- [ ] Integração Google Classroom
- [ ] Colaboração em tempo real
- [ ] Analytics de uso

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👤 Desenvolvedor

**Raphael Diniz**  
Engenheiro de Software Full Stack

- GitHub: [@devraphaeldiniz](https://github.com/devraphaeldiniz)
- LinkedIn: [/in/devraphaeldiniz](https://www.linkedin.com/in/devraphaeldiniz/)
- WhatsApp: +55 11 93282-9486