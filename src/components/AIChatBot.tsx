import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AIChatBot() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const addMessage = (role: string, content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
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

      console.log('SUPABASE FULL RESPONSE:', { data, error });

      if (error) {
        console.warn('SUPABASE ERROR:', error);
      }

      // ✅ SAFE RESPONSE HANDLING (IMPORTANT FIX)
      const botResponse =
        data?.reply ||
        data?.response ||
        data?.data?.reply ||
        error?.message ||
        "I'm having trouble responding right now. Please try again.";

      addMessage('bot', botResponse);
    } catch (err) {
      console.error('CHAT FUNCTION CRASHED:', err);

      addMessage(
        'bot',
        'Sorry, I encountered an error. Please try again or contact support.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl rounded-xl p-3">
      {/* Chat messages */}
      <div className="h-64 overflow-y-auto border p-2 rounded mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-200'
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type message..."
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={loading}
          className="bg-black text-white px-3 rounded"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}