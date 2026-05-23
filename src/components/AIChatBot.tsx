import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Trash2, Loader } from 'lucide-react';
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
  const chatRef = useRef<HTMLDivElement>(null);

  // Load chat history and theme on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('eclection_chat_history');
    const savedTheme = localStorage.getItem('eclection_chat_theme');

    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch {
        // Invalid JSON, start fresh
      }
    } else {
      // Initial welcome message
      setMessages([{
        id: '0',
        role: 'bot',
        content: "Hi 👋 Welcome to E-Style Collection Hub. How can I help you today?",
        timestamp: Date.now(),
      }]);
    }

    if (savedTheme) {
      setIsDark(JSON.parse(savedTheme));
    }
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem('eclection_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('eclection_chat_theme', JSON.stringify(isDark));
  }, [isDark]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'bot', content: string) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    addMessage('user', messageText);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message: messageText },
      });

      if (error) throw error;
      const botResponse = data?.response || "I'm having trouble responding. Please try again.";
      addMessage('bot', botResponse);
    } catch {
      addMessage('bot', "Sorry, I encountered an error. Please try again or contact support on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const message = QUICK_ACTION_MESSAGES[action as keyof typeof QUICK_ACTION_MESSAGES];
    if (message) {
      handleSendMessage(message);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear chat history? This cannot be undone.')) {
      setMessages([{
        id: '0',
        role: 'bot',
        content: "Hi 👋 Welcome to E-Style Collection Hub. How can I help you today?",
        timestamp: Date.now(),
      }]);
      localStorage.removeItem('eclection_chat_history');
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const bgClass = isDark ? 'bg-stone-900' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-stone-900';
  const inputBgClass = isDark ? 'bg-stone-800 text-white border-stone-700' : 'bg-white text-stone-900 border-stone-200';
  const messageBotBgClass = isDark ? 'bg-stone-800' : 'bg-stone-100';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-600 hover:shadow-xl text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-700/40 transition-all duration-300 hover:scale-110 animate-bounce"
        aria-label="Open AI Chat"
        title="E-Style AI Concierge"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-6 right-6 z-50 w-full max-w-sm h-[600px] ${bgClass} rounded-2xl shadow-2xl flex flex-col border border-stone-200 ${isDark ? 'border-stone-700' : ''} overflow-hidden animate-scale-in`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div>
            <p className="text-[13px] font-semibold">E-Style AI Concierge</p>
            <p className="text-[11px] text-stone-300">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Minimize"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-5 space-y-4 ${bgClass}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                {msg.role === 'bot' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white bg-stone-900`}>
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-700 text-white rounded-br-sm'
                      : `${messageBotBgClass} ${textClass} rounded-bl-sm border border-stone-300 ${isDark ? 'border-stone-600' : ''}`
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white bg-stone-400">
                    👤
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-stone-900">
                  🤖
                </div>
                <div className={`px-4 py-2.5 rounded-xl rounded-bl-sm border ${messageBotBgClass} ${isDark ? 'border-stone-600' : 'border-stone-300'}`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (show when few messages) */}
          {messages.length <= 2 && !loading && (
            <div className={`px-5 pb-3 grid grid-cols-2 gap-2 flex-shrink-0 border-t ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className={`text-[11px] font-medium px-3 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleChatSubmit} className={`px-5 py-4 border-t flex-shrink-0 flex gap-2 ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 min-w-0 border px-3 py-2.5 text-[13px] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all rounded-lg ${inputBgClass}`}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-amber-700 text-white rounded-lg flex items-center justify-center hover:bg-amber-800 transition-colors disabled:opacity-40 flex-shrink-0"
              aria-label="Send"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          {/* Footer with clear button */}
          <div className={`px-5 py-2 flex justify-end border-t text-[11px] flex-shrink-0 ${isDark ? 'border-stone-700 bg-stone-800/50' : 'border-stone-200 bg-stone-50'}`}>
            <button
              onClick={clearHistory}
              className={`flex items-center gap-1 ${isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-500 hover:text-stone-700'} transition-colors`}
              aria-label="Clear chat history"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
