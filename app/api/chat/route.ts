import { NextRequest, NextResponse } from "next/server";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        messages: [
          {
            role: "system",
            content: `You are MemoryChat, a helpful and intelligent AI assistant.
You have access to the full conversation history and should reference past messages
when relevant to demonstrate your memory. Be conversational, thoughtful, and personable.
When a user mentions something about themselves (name, preferences, facts), remember it
and reference it naturally in future responses.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama request failed — make sure Ollama is running");
    }

    const data = await response.json();
    const assistantMessage = data.message?.content ?? "";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Ollama error:", error);
    return NextResponse.json(
      {
        error:
          "Could not reach Ollama. Make sure it's running with: ollama serve",
      },
      { status: 500 }
    );
  }
}