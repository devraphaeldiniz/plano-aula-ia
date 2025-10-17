\# Escolha do Modelo Gemini



\## Modelo Selecionado

\*\*gemini-2.5-flash\*\*



\## Justificativa



\### Critérios Avaliados

\- \*\*Velocidade\*\*: Modelo Flash otimizado para respostas rápidas

\- \*\*Custo\*\*: Tier gratuito com 15 requisições/minuto

\- \*\*Capacidade\*\*: 1M tokens de entrada, 65k tokens de saída

\- \*\*Qualidade\*\*: Versão 2.5 mais recente com melhor compreensão

\- \*\*Disponibilidade\*\*: Acessível via Google AI Studio sem cartão



\### Comparação



| Modelo | Velocidade | Custo Free | Context | Ideal Para |

|--------|-----------|-----------|---------|------------|

| gemini-2.5-flash | ⚡⚡⚡ | 15/min | 1M | Produção MVP |

| gemini-2.5-pro | ⚡⚡ | 2/min | 1M | Alta complexidade |

| gemini-2.0-flash | ⚡⚡⚡ | 15/min | 1M | Versão anterior |



\### Decisão Final

O \*\*gemini-2.5-flash\*\* equilibra perfeitamente:

\- Velocidade de resposta para UX fluida

\- Qualidade suficiente para planos de aula detalhados

\- Custo zero adequado para MVP e demonstração

\- Context window amplo para prompts estruturados complexos



\### Configuração Utilizada

```typescript

model: "gemini-2.5-flash"

temperature: 0.8 (balanceamento criatividade/consistência)

API: v1 (estável)

```



A temperatura de 0.8 foi escolhida para manter criatividade nas introduções lúdicas sem comprometer a estrutura do JSON de saída.

