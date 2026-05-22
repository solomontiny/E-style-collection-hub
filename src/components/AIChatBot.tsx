import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function AIChatBot() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const addMessage = (role: string, content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

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

      console.log('SUPABASE RESPONSE:', { data, error });

      const botResponse =
        data?.reply ??
        data?.response ??
        data?.data?.reply ??
        error?.message ??
        "I'm having trouble responding right now.";

      addMessage('bot', botResponse);
    } catch (err: any) {
      console.error(err);

      addMessage(
        'bot',
        'Sorry, something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OPEN BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      )}

      {/* CHAT BOX */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-5 right-5 w-80 h-[500px] bg-white shadow-xl rounded-xl flex flex-col z-50"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold">AI Assistant</span>

            <button onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <span
                  className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
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

          {/* INPUT */}
          <div className="p-3 flex gap-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 border rounded px-2 py-1"
              placeholder="Type message..."
              disabled={loading}
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
      )}
    </>
  );
}