"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "./api/chat/route";

interface DisplayMessage extends Message {
  id: string;
  timestamp: Date;
}

function TypingIndicator() {
  return (
    <div className="message-appear flex gap-3 items-start mb-6">
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00e5ff22, #7c3aed22)",
          border: "1px solid #00e5ff44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 14,
        }}
      >
        M
      </div>
      <div
        style={{
          background: "var(--ai-bubble)",
          border: "1px solid var(--ai-border)",
          borderRadius: "2px 12px 12px 12px",
          padding: "12px 16px",
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5ff", display: "block" }} />
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5ff", display: "block" }} />
        <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5ff", display: "block" }} />
      </div>
    </div>
  );
}

function ChatMessage({ msg }: { msg: DisplayMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className="message-appear"
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 12,
        alignItems: "flex-start",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isUser ? "linear-gradient(135deg, #f9731622, #7c3aed22)" : "linear-gradient(135deg, #00e5ff22, #7c3aed22)",
          border: isUser ? "1px solid #f9731644" : "1px solid #00e5ff44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 12,
          fontFamily: "'Space Mono', monospace",
          color: isUser ? "#f97316" : "#00e5ff",
          letterSpacing: "-0.05em",
        }}
      >
        {isUser ? "U" : "M"}
      </div>

      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 10,
            fontFamily: "'Space Mono', monospace",
            color: "var(--text-dim)",
            textAlign: isUser ? "right" : "left",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {isUser ? "YOU" : "MEMORYCHAT"} · {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>

        <div
          style={{
            background: isUser ? "var(--user-bubble)" : "var(--ai-bubble)",
            border: `1px solid ${isUser ? "var(--user-border)" : "var(--ai-border)"}`,
            borderRadius: isUser ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
            padding: "12px 16px",
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--text)",
            fontFamily: "'Syne', sans-serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [memoryCount, setMemoryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const apiMessages: Message[] = newMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMessage: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setMemoryCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Make sure Ollama is running with: ollama serve",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMemoryCount(0);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <div className="scanline" />

      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(8, 11, 15, 0.9)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36, height: 36, border: "1px solid var(--accent)", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0, 229, 255, 0.05)", boxShadow: "0 0 12px rgba(0, 229, 255, 0.15)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3" fill="#00e5ff" opacity="0.9" />
              <circle cx="9" cy="9" r="7" stroke="#00e5ff" strokeWidth="1" opacity="0.3" />
              <line x1="2" y1="9" x2="6" y2="9" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
              <line x1="12" y1="9" x2="16" y2="9" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
              <line x1="9" y1="2" x2="9" y2="6" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
              <line x1="9" y1="12" x2="9" y2="16" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
          <div>
            <h1 className="glow-text" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent)", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
              MemoryChat
            </h1>
            <p style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", marginTop: 2 }}>
              POWERED BY LLAMA 3.2
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: memoryCount > 0 ? "#7c3aed" : "var(--text-dim)", boxShadow: memoryCount > 0 ? "0 0 6px #7c3aed" : "none" }} />
            <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: memoryCount > 0 ? "#a78bfa" : "var(--text-dim)", letterSpacing: "0.05em" }}>
              {memoryCount} memories
            </span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: "var(--text-dim)", background: "transparent", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 10px", cursor: "pointer", letterSpacing: "0.05em" }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.color = "#f97316"; (e.target as HTMLButtonElement).style.borderColor = "#f97316"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.color = "var(--text-dim)"; (e.target as HTMLButtonElement).style.borderColor = "var(--border)"; }}
            >
              CLEAR
            </button>
          )}
        </div>
      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px", maxWidth: 800, width: "100%", margin: "0 auto" }}>
        {messages.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 24, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, border: "1px solid var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 229, 255, 0.03)", boxShadow: "0 0 40px rgba(0, 229, 255, 0.08), inset 0 0 20px rgba(0, 229, 229, 0.03)" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="5" fill="#00e5ff" opacity="0.7" />
                <circle cx="16" cy="16" r="12" stroke="#00e5ff" strokeWidth="1" opacity="0.2" />
                <circle cx="16" cy="16" r="8" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 8 }}>Start a conversation</h2>
              <p style={{ color: "var(--text-dim)", fontSize: 13, fontFamily: "'Space Mono', monospace", lineHeight: 1.7, maxWidth: 380 }}>
                MemoryChat remembers everything you tell it within this session.<br />Try introducing yourself.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {["Hi, my name is Tymofii", "What can you help me with?", "I'm a CS student"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  style={{ padding: "6px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: 20, color: "var(--text-dim)", fontSize: 12, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}
                  onMouseEnter={(e) => { const el = e.target as HTMLButtonElement; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)"; el.style.background = "rgba(0,229,255,0.05)"; }}
                  onMouseLeave={(e) => { const el = e.target as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-dim)"; el.style.background = "transparent"; }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div style={{ padding: "16px 24px 24px", borderTop: "1px solid var(--border)", background: "rgba(8, 11, 15, 0.95)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div
            style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-end" }}
            onFocusCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0, 229, 255, 0.4)"; }}
            onBlurCapture={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message... (Enter to send, Shift+Enter for newline)"
              rows={1}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 14, fontFamily: "'Syne', sans-serif", lineHeight: 1.6, resize: "none", width: "100%" }}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            style={{
              width: 44, height: 44, borderRadius: 10, border: "1px solid",
              borderColor: isLoading || !input.trim() ? "var(--border)" : "var(--accent)",
              background: isLoading || !input.trim() ? "transparent" : "rgba(0, 229, 255, 0.1)",
              color: isLoading || !input.trim() ? "var(--text-dim)" : "var(--accent)",
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: isLoading || !input.trim() ? "none" : "0 0 12px rgba(0, 229, 255, 0.15)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 8L2 2l3 6-3 6 12-6z" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 10, color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", marginTop: 10, letterSpacing: "0.05em" }}>
          MEMORYCHAT · BUILT WITH NEXT.JS + LLAMA 3.2
        </p>
      </div>
    </div>
  );
}