import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// 🔒 Simple in-memory rate limiter (per server instance)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const MAX_REQUESTS = 15;

let requestLog: number[] = [];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ✅ Rate limiting
    const now = Date.now();
    requestLog = requestLog.filter((t) => now - t < RATE_LIMIT_WINDOW);

    if (requestLog.length >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    requestLog.push(now);

    const body: {
      message?: string;
      messages?: { role: string; content: string }[];
    } = await req.json();

    const { message, messages } = body;

    if (!message && !messages) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemPrompt = `
You are the official WasteWise AI Assistant, a helpful and friendly chatbot for the WasteWise food redistribution platform. 

Here is important information about how the website works:
- How to donate food / Post surplus: Tell users they must first go to Register and fill in their details. After that, they need to Sign In. Once signed in, they will find a button named "Post Surplus" where they can list the food they want to donate.
- General purpose: WasteWise helps connect surplus food with those who need it to reduce food waste.

Please keep your answers concise, friendly, and relevant to the WasteWise platform. If asked something unrelated, gently try to steer the conversation back to food waste or platform features.


Purpose:
- Help users donate surplus food
- Guide them on using the WasteWise platform

Instructions:
- Keep answers short and helpful
- If unrelated question → gently redirect to food waste topic

Platform flow:
1. Register
2. Sign in
3. Click "Post Surplus"
4. Add food details
`;

    // ✅ Context-aware messages (last 5)
    const chatHistory =
      messages?.slice(-5).map((m) => ({
        role: m.role === "assistant" ? "model" : m.role, // ⚠️ FIX: Gemini expects "model" or "user" instead of "assistant"
        parts: [{ text: m.content }],
      })) || [
        {
          role: "user",
          parts: [{ text: message! }],
        },
      ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return NextResponse.json(
      { reply: response.text || "No response generated." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
