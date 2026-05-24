import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Trash2, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'bot', content: string) => {
    const newMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    addMessage('user', messageText);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: messageText },
      });

      console.log("🔥 SUPABASE RESPONSE:", { data, error });

      // 🚨 SHOW REAL ERROR IF ANY
      if (error) {
        console.error("❌ SUPABASE ERROR:", error);
        addMessage('bot', error.message || "Server error occurred");
        return;
      }

      // ✅ SAFE RESPONSE HANDLING
      const botResponse =
        data?.reply ||
        data?.response ||
        data?.data?.reply ||
        "I'm having trouble responding right now.";

      addMessage('bot', botResponse);

    } catch (err: any) {
      console.error("🔥 NETWORK ERROR:", err);

      addMessage(
        'bot',
        err?.message || "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // OPEN BUTTON
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <MessageCircle />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden border">

      {/* HEADER */}
      <div className="bg-black text-white p-3 flex justify-between items-center">
        <span>AI Assistant</span>

        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>

          <button onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* CHAT BODY */}
      {!isMinimized && (
        <>
          <div className="flex-1 p-3 overflow-y-auto h-80 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">Typing...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form onSubmit={handleSubmit} className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded px-2 py-1 text-sm"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-3 rounded"
            >
              {loading ? <Loader size={16} /> : <Send size={16} />}
            </button>
          </form>
        </>
      )}
    </div>
  );
}