import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles } from "lucide-react";
import { serverUrl } from "@/main";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm EcoBot, your personal sustainability assistant. I can help you understand your pollution score, suggest eco-friendly alternatives, and provide tips for a greener lifestyle. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${serverUrl}/api/v3/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "EcoBot is currently unavailable 🌍",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[linear-gradient(180deg,#0c1210_0%,#0a1a14_50%,#081210_100%)]">

      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#1db954,#14b8a6,#0ea5e9)] flex items-center justify-center">
          <Bot className="w-5 h-5 text-[#0c1210]" />
        </div>
        <div>
          <h3 className="font-semibold text-white">EcoBot</h3>
          <p className="text-xs text-white/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-powered sustainability assistant
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,#1db954,#14b8a6,#0ea5e9)] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#0c1210]" />
              </div>
            )}

            {/* MESSAGE BUBBLE */}
            <div
              className={`max-w-[72%] rounded-2xl px-5 py-4 backdrop-blur-md ${
                msg.role === "user"
                  ? "bg-[linear-gradient(135deg,rgba(29,185,84,0.18),rgba(20,184,166,0.18))] ring-1 ring-[#1db954]/30"
                  : "bg-[linear-gradient(135deg,rgba(27,42,36,0.85),rgba(19,31,26,0.85))] ring-1 ring-white/10 shadow-[0_0_40px_rgba(29,185,84,0.08)]"
              }`}
            >
              <p className="text-sm leading-relaxed text-[#e6f0ea]">
                {msg.content}
              </p>
              <span className="text-[10px] mt-2 block text-[#8fa396]">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#243630] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#c9ddd0]" />
              </div>
            )}
          </div>
        ))}

        {/* LOADER */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,#1db954,#14b8a6,#0ea5e9)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#0c1210]" />
            </div>
            <div className="px-5 py-4 rounded-2xl backdrop-blur-md bg-[linear-gradient(135deg,rgba(27,42,36,0.85),rgba(19,31,26,0.85))] ring-1 ring-white/10 flex gap-1">
              <span className="w-2 h-2 bg-[#8fa396] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#8fa396] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-[#8fa396] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about eco score, tips, or alternatives…"
            className="
              flex-1
              rounded-xl
              px-5 py-3
              bg-[#131f1a]
              border border-[#2d4a40]
              text-[#dceee2]
              text-sm
              placeholder:text-[#8fa396]
              outline-none
              focus:border-[#1db954]
            "
          />
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-12 h-12
              rounded-xl
              bg-[linear-gradient(135deg,#1db954,#14b8a6,#0ea5e9)]
              flex items-center justify-center
              hover:opacity-90
              transition
            "
          >
            <Send className="w-4 h-4 text-[#0c1210]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
