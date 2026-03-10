import { useState, useRef, useEffect } from "react";
import API from "../api/axios.config";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your hotel concierge. Ask me about destinations, or places!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await API.post("/chatbot/chat", {
        messages: updatedMessages,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {isOpen && (
        <div
          style={{
            width: 360,
            height: 520,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #f46b45, #eea849)",
              color: "#fff",
              padding: "16px 20px",
              fontWeight: "bold",
              fontSize: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>🏨 Hotel Concierge</span>
            <span style={{ fontSize: 11, fontWeight: "normal", opacity: 0.85 }}>
              Powered by Groq ⚡
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "#fafafa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #f46b45, #eea849)"
                      : "#fff",
                  color: msg.role === "user" ? "#fff" : "#333",
                  padding: "10px 14px",
                  borderRadius:
                    msg.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  maxWidth: "80%",
                  fontSize: 14,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#fff",
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  fontSize: 14,
                  color: "#999",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
              >
                Typing...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: 12,
              borderTop: "1px solid #eee",
              gap: 8,
              background: "#fff",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about rooms, destinations..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                outline: "none",
                fontSize: 14,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #f46b45, #eea849)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 16px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: 14,
                opacity: loading ? 0.7 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "linear-gradient(135deg, #f46b45, #eea849)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 58,
          height: 58,
          fontSize: 26,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          display: "block",
          marginLeft: "auto",
          marginTop: isOpen ? 12 : 0,
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
