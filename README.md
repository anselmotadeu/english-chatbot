# English Chatbot with Schedule

Um chatbot interativo para aprender inglês, com cronograma integrado para organizar seus estudos. Construído com Next.js, Gemma 3 e tecnologias de voz, este projeto é 100% gratuito e hospedado no Vercel.

## Objetivo
Ajudar o usuário a praticar inglês através de conversas por texto e voz, com correções em tempo real, enquanto organiza aulas e tarefas em um cronograma personalizado.

## Funcionalidades
### Chatbot
- **Conversa por Texto**: Dialogue em inglês com o chatbot e receba respostas naturais geradas pelo Gemma 3.
- **Conversa por Voz**: Fale com o chatbot e ouça respostas faladas (usando Web Speech API para entrada e gTTS para saída).
- **Correção de Erros**: O chatbot identifica e corrige erros de gramática ou vocabulário em tempo real.
- **Exercícios**: Pratique com perguntas de vocabulário, completar frases ou traduções.
- **Níveis**: Suporte a níveis de inglês (Básico, Intermediário, Avançado).

### Cronograma
- **Tarefas Personalizadas**: Adicione aulas ou metas (ex.: "Estudar verbos às 14h").
- **Lembretes**: Receba notificações no navegador ou por voz.
- **Progresso**: Veja quantas tarefas você completou em um gráfico simples.

## Regras do Projeto
1. **Layout**: 
   - Interface dividida: à esquerda o cronograma (lista ou calendário), à direita o chat com input de texto e botão de voz.
   - Estilo moderno, limpo e acolhedor, inspirado em chatbots como Grok.
2. **Chatbot**:
   - Respostas devem simular um fluxo de digitação (efeito visual).
   - Correção de erros em negrito (verde para acertos, vermelho para erros).
   - Suporte a voz bidirecional (falar e ouvir).
3. **Cronograma**:
   - Armazenado no LocalStorage para uso offline.
   - Opção de adicionar, editar e remover tarefas.
   - Lembretes ativados por padrão.
4. **Tecnologia**:
   - Frontend: Next.js com React.
   - Backend: Node.js com Gemma 3 (via Hugging Face ou Google AI Studio).
   - Voz: Web Speech API (entrada) e gTTS (saída).
   - Hospedagem: Vercel (usando o domínio `codefort.com.br`).
5. **Gratuito**: Todas as ferramentas devem ser open-source ou com planos gratuitos.

## Como Começar
### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Conta no Vercel (opcional para deploy)
- Token do Hugging Face (para Gemma 3)

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/english-chatbot.git
   cd english-chatbot

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente em `.env.local`:
```text
HF_TOKEN=seu-token-do-hugging-face
```

4. Rode localmente:
```bash
npm run dev
```

Acesse em `http://localhost:3000`.

## Deploy no Vercel

1. Conecte o repositório ao Vercel:
```bash
vercel
```

2. Configure o domínio `codefort.com.br` no painel do Vercel.

## Estrutura do Projeto

```text
english-chatbot/
├── app/
│   ├── api/
│   │   └── chat/route.ts      # Integração com Gemma 3
│   └── page.tsx               # Página principal (chat + cronograma)
├── components/
│   ├── Chat.tsx              # Componente do chat
│   └── Schedule.tsx          # Componente do cronograma
├── public/                   # Arquivos estáticos
├── styles/                   # CSS global e modular
└── README.md
```

## Próximos Passos
Adicionar gamificação (pontos por tarefas concluídas).
Integrar recursos externos (ex.: links para vídeos de inglês).
Melhorar o design com Tailwind CSS.
Contribuições
Sinta-se à vontade para abrir issues ou pull requests!

Feito com 💙 por [Anselmo Santos] com ajuda do Grok (xAI).