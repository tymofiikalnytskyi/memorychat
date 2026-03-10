# MemoryChat 🧠

A full-stack AI chatbot with persistent conversation memory, built with **Next.js**, **React**, and **Llama 3.2** running locally via Ollama. No API keys. No costs. Fully private.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Ollama](https://img.shields.io/badge/Ollama-Llama_3.2-white?style=flat-square)

---

## Features

- 💬 **Real-time AI chat** powered by Llama 3.2 running locally
- 🧠 **Conversation memory** — the AI remembers everything you say in the session
- 🔒 **100% private** — your conversations never leave your machine
- ⚡ **Next.js App Router** with TypeScript for a modern full-stack architecture
- 🎨 **Sleek dark UI** with smooth animations and a custom design system
- 📱 **Responsive** — works on mobile and desktop
- 💸 **Completely free** — no API keys, no subscriptions, no usage limits

---

## Demo

> Start a conversation, introduce yourself, and watch MemoryChat reference what you said earlier in the conversation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | CSS Variables, custom animations |
| AI Model | Llama 3.2 via Ollama |
| API | Next.js App Router API routes |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- [Ollama](https://ollama.com) installed on your machine

### 1. Clone the repo

```bash
git clone https://github.com/tymofiikalnytskyi/memorychat.git
cd memorychat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Pull the Llama model

```bash
ollama pull llama3.2
```

### 4. Start Ollama

```bash
ollama serve
```

### 5. Run the development server

Open a new terminal window and run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and start chatting!

---

## How Memory Works

MemoryChat sends the **full conversation history** to the model on every message. This gives the AI complete context of everything discussed, allowing it to:

- Remember your name and personal details
- Reference earlier parts of the conversation
- Build on previous answers
- Maintain consistent context throughout the session

```
User: "Hi, I'm Tymofii and I'm studying Computer Science"
AI:   "Nice to meet you, Tymofii! What are you working on?"

[10 messages later...]

User: "What should I learn next?"
AI:   "Given your CS background, Tymofii, I'd suggest..."
```

Memory is session-based and resets when you clear the chat or refresh the page.

---

## Project Structure

```
memorychat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Ollama API integration
│   ├── globals.css           # Global styles & design tokens
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main chat interface
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Author

**Tymofii Kalnytskyi**  
CS & AI Student @ Adelphi University  
[GitHub](https://github.com/tymofiikalnytskyi) · [LinkedIn](https://linkedin.com/in/kalnytskyi)

---

## License

MIT — feel free to use this as a starting point for your own projects.
