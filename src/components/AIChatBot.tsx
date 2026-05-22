import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Loader,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

const QUICK_ACTIONS = [
  { label: 'Track Order', icon: '📦', action: 'track_order' },
  { label: 'Payment Help', icon: '💳', action: 'payment_help' },
  { label: 'Returns', icon: '↩️', action: 'returns' },
  { label: 'Contact Support', icon: '👋', action: 'contact_support' },
];

const QUICK_ACTION_MESSAGES = {
  track_order: 'I want to track my order. Can you help me?',
  payment_help: 'I need help with payment options',
  returns: 'What is your return policy?',
  contact_support: 'I need to speak with customer support',
};

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eclection_chat_history');

    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: '0',
          role: 'bot',
          content:
            'Hi 👋 Welcome to E-Style Collection Hub. How can I help you today?',
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'eclection_chat_history',
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const addMessage = (role: 'user' | 'bot', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    addMessage('user', messageText);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        'chat',
        {
          body: { message: messageText },
        }
      );

      console.log('SUPABASE RESPONSE:', data, error);

      if (error) throw error;

      const reply =
        data?.reply ||
        data?.response ||
        "I'm having trouble responding.";

      addMessage('bot', reply);
    } catch (err) {
      console.error(err);

      addMessage(
        'bot',
        'Sorry, I encountered an error. Please try again or contact support.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <MessageCircle />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white shadow-2xl rounded-xl flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center p-3 bg-amber-700 text-white">
        <span>E-Style AI</span>
        <button onClick={() => setIsOpen(false)}>
          <X />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 ${
              m.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span className="inline-block px-3 py-2 rounded bg-gray-100">
              {m.content}
            </span>
          </div>
        ))}

        {loading && <p>Typing...</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSubmit} className="p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button className="bg-amber-700 text-white px-3 rounded">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}