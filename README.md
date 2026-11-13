# 🛡️ Sentinel AI — Intelligence Platform

[![Node Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Sentinel AI** is a complete, production-ready, full-stack AI chatbot and adaptive intelligence platform. Built with a React + TypeScript + Tailwind CSS frontend and a high-performance Express SSE streaming backend, Sentinel AI delivers plug-and-play multi-provider intelligence (**Gemini**, **OpenAI**, **Anthropic**, and a **Zero-Dependency Local Mock Engine**), context-aware file attachment analysis, persona switching, and persistent conversation management.

---

## ✨ Features

- ⚡ **Real-Time Token Streaming**: High-throughput Server-Sent Events (SSE) streaming with instantaneous token rendering, backpressure control, and instant "Stop Generating" cancellation.
- 🔌 **Plug & Play Multi-Model Architecture**:
  - **Google Gemini**: Gemini 2.5 Flash, Gemini 1.5 Pro via `@google/genai`.
  - **OpenAI**: GPT-4o, GPT-4o Mini, o1/o3-mini via `openai`.
  - **Anthropic**: Claude 3.7 Sonnet, Claude 3.5 Haiku via `@anthropic-ai/sdk`.
  - **Sentinel Mock Core (Offline)**: Built-in local simulator with realistic streaming, code generation, and persona awareness — zero API keys needed out of the box!
- 🗂️ **Context-Aware File Attachments**: Attach source code (`.ts`, `.py`, `.js`, `.json`, `.sql`, etc.) or text documents (`.md`, `.txt`, `.csv`) directly via the 📎 button to perform contextual audits and Q&A.
- 🎭 **Specialized Personas & System Prompts**:
  - **Sentinel Prime**: Precision general intelligence.
  - **Code Architect & Refactorer**: System design, DRY principles, and performance profiling.
  - **Cyber & Threat Analyst**: Security reviews, threat modeling, and OWASP hardening.
  - **Technical Tutor**: Socratic explanations and first-principles breakdowns.
  - **Creative & Narrative Strategist**: Storytelling and punchy copy.
  - **Custom System Prompt**: Define custom personas directly from the UI.
- 🎨 **Modern Dark & Light Themes**: Cyber-obsidian dark palette (`#0B0F19`) and crisp clean light theme with instant toggling and persistence.
- 💻 **Syntax-Highlighted Code Blocks**: Automatic language tag detection, line numbering, single-click "Copy Code" feedback, and monospace formatting.
- 🗄️ **Persistent Chat History**: Fast sidebar management with New Chat, title renaming, search, export to Markdown, and local SQLite/JSON persistence.
- 📊 **Live Telemetry & Token Counter**: Real-time processed token counter and response latency measurement.

---

## 🏗️ Architecture

```
sentinel/
├── client/                     # Frontend (React 18 + Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/         # ChatArea, Sidebar, Header, CodeBlock, SettingsModal
│   │   ├── hooks/              # useChatStream (SSE reader), useTheme
│   │   ├── types/              # Frontend TypeScript interfaces
│   │   └── App.tsx             # Root application orchestrator
│   └── vite.config.ts          # API reverse proxy configuration
├── server/                     # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── adapters/           # Multi-provider adapter layer (Gemini, OpenAI, Anthropic, Mock)
│   │   ├── controllers/        # Chat streaming, history, and models controllers
│   │   ├── db/                 # Local persistence layer (data/sentinel_history.json)
│   │   └── index.ts            # Express server initialization
│   └── tests/                  # Automated integration tests
├── .env.example                # Environment variables template
└── package.json                # Root monorepo workspace configuration
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/Rohit30Confluence/sentinel.git
cd sentinel

# Install root, client, and server dependencies
npm install
```

### 3. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` if you would like to provide default server API keys:
```env
PORT=3001
CLIENT_URL=http://localhost:5173

# Optional: Add your API keys here, or enter them in the UI Settings modal
GEMINI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

> 💡 **Tip**: You don't need any API keys to start! The built-in **Sentinel Mock Core** works immediately offline. When you want to use frontier models, simply open the **Settings (⚙️)** in the top bar and enter your key.

### 4. Launch Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/api/health`

---

## 🧪 Running Automated Tests

Run the backend integration test suite to verify SSE streaming, model adapters, and storage:
```bash
npm test
```

To run a production build:
```bash
npm run build
```

---

## 🛡️ License

Distributed under the [MIT License](LICENSE).
