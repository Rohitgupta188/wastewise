"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Square,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ApiResponse {
  reply?: string;
  error?: string;
}

const SUGGESTIONS: string[] = [
  "How do I donate food?",
  "Food safety guidelines",
  "How does AI matching work?",
  "Tips to reduce food waste",
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! 👋 I'm WasteWise AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isTypingRef = useRef<boolean>(false);

  const scrollToBottom = useCallback((): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ✅ Optimized typing animation with chunking
  const typeText = async (text: string, id: string): Promise<void> => {
    isTypingRef.current = true;
    let current = "";
    const chunkSize = 2; // Injecting more characters per frame reduces re-renders

    for (let i = 0; i < text.length; i += chunkSize) {
      if (!isTypingRef.current) break;
      current += text.substring(i, i + chunkSize);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, content: current } : m
        )
      );

      await new Promise((res) => setTimeout(res, 15));
    }
    isTypingRef.current = false;
  };

  const stopGeneration = () => {
    isTypingRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();

    // Placeholder for typing effect
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
        }),
        signal: abortControllerRef.current.signal,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limited");
        throw new Error(data.error || "Request failed");
      }

      await typeText(data.reply || "", assistantId);

    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted by user");
        return;
      }

      let msg =
        "Sorry, I'm having trouble right now. Please try again later 🙏";

      if (error instanceof Error) {
        if (error.message === "Rate limited") {
          msg = "Too many requests 😅 Please wait a few seconds.";
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: msg } : m
        )
      );
    } finally {
      setIsLoading(false);
      isTypingRef.current = false;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center z-10 shadow-sm relative">
            <span className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-100" /> WasteWise AI
            </span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-green-700 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`px-4 py-2.5 max-w-[85%] text-[15px] shadow-sm leading-relaxed ${
                    msg.role === "user"
                    ? "bg-green-600 text-white rounded-2xl rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
                    }`}
                >
                  {msg.content || (
                    <Loader2 className="animate-spin w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs bg-white border border-green-200 text-green-700 px-3.5 py-2 rounded-full hover:bg-green-50 hover:border-green-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm placeholder:text-gray-400 text-gray-700"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            {isLoading ? (
              <button 
                type="button"
                onClick={stopGeneration}
                className="bg-red-500 text-white p-2.5 rounded-full flex items-center justify-center hover:bg-red-600 transition-transform active:scale-95 shadow-sm"
                title="Stop generation"
                aria-label="Stop generation"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-green-600 text-white p-2.5 rounded-full flex items-center justify-center hover:bg-green-700 transition-transform active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-600/30 hover:bg-green-700 hover:-translate-y-1 hover:shadow-xl transition-all z-50 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-90"
        aria-label={isOpen ? "Close chat box" : "Open chat box"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
