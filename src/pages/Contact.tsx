import { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Bot, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const WHATSAPP_NUMBER = '2348081759542';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What are your shipping options?',
  'How do I track my order?',
  'What is your return policy?',
  'How do I contact customer support?',
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I\'m the Eclection AI assistant. I can help you with orders, products, shipping, returns, and more. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMessage = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message: userMessage },
      });

      if (error) throw error;
      setMessages((prev) => [...prev, { role: 'assistant', content: data?.response || 'I\'m sorry, I couldn\'t process that. Please try again or contact us on WhatsApp.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again or reach out to us on WhatsApp for immediate assistance.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="relative h-[35vh] sm:h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1920')` }}
        >
          <div className="absolute inset-0 bg-stone-950/60" />
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <p className="section-label text-stone-300 mb-3">We're Here to Help</p>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight">Customer Service</h1>
        </div>
      </section>

      {/* AI Assistant + Contact Info */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Contact Info */}
            <div>
              <p className="section-label mb-5">Reach Out</p>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-stone-900 tracking-tight leading-[1.15]">
                We would love
                <br />
                <span className="italic font-normal">to hear from you</span>
              </h2>
              <p className="mt-6 text-stone-500 font-light leading-[1.8] text-[15px] max-w-md">
                Whether you have a question about our collections, need styling advice, or simply want to share your
                experience, our team is here for you.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { icon: MapPin, label: 'Visit Us', value: '5 Path Akachukwu Drive, Majek, Lekki–Epe Expressway, Lagos' },
                  { icon: Phone, label: 'Call Us', value: '+234 808 175 9542' },
                  { icon: Mail, label: 'Email Us', value: 'Meggieakenn@gmail.com' },
                  { icon: Clock, label: 'Opening Hours', value: 'Mon — Sat: 10:00 — 19:00' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-stone-50 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} strokeWidth={1.5} className="text-stone-400" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1 font-semibold">{item.label}</p>
                      <p className="text-[14px] text-stone-600 font-light">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Eclection! I would like to get in touch.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.12em] uppercase font-medium text-emerald-600 border border-emerald-200 px-5 py-3 hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>

            {/* Right: AI Chat */}
            <div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden flex flex-col" style={{ height: 520 }}>
                {/* Chat Header */}
                <div className="px-6 py-4 bg-stone-900 text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">AI Support Assistant</p>
                    <p className="text-[10px] text-stone-400">Online — typically replies instantly</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot size={12} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-4 py-3 rounded-xl text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-stone-900 text-white rounded-br-sm'
                          : 'bg-white border border-stone-200 text-stone-700 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User size={12} className="text-stone-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={12} className="text-white" />
                      </div>
                      <div className="bg-white border border-stone-200 px-4 py-3 rounded-xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 2 && (
                  <div className="px-5 pb-3 flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-3 py-1.5 border border-stone-200 rounded-full text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="px-5 py-4 border-t border-stone-200 flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about orders, products, shipping..."
                    className="flex-1 min-w-0 border border-stone-200 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-none focus:border-stone-400 transition-colors rounded-lg"
                    disabled={chatLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || chatLoading}
                    className="w-10 h-10 bg-stone-900 text-white rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mx-auto">
            <p className="section-label mb-5 text-center">Still Need Help?</p>
            <h2 className="text-3xl font-display font-medium text-stone-900 tracking-tight text-center mb-12">
              Send Us a Message
            </h2>
            {submitted ? (
              <div className="bg-white p-12 sm:p-16 text-center animate-scale-in border border-stone-200 rounded-xl">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-emerald-700 text-xl">&#10003;</span>
                </div>
                <p className="text-stone-900 font-medium text-lg">Thank you for reaching out.</p>
                <p className="text-stone-500 font-light text-sm mt-2">We will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">First Name</label>
                    <input type="text" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Last Name</label>
                    <input type="text" required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Email</label>
                  <input type="email" required className="input-field" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Subject</label>
                  <select className="input-field bg-white">
                    <option>General Inquiry</option>
                    <option>Styling Advice</option>
                    <option>Order Support</option>
                    <option>Returns & Exchanges</option>
                    <option>Press & Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Message</label>
                  <textarea rows={5} required className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full mt-2">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating Chat Button (mobile) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 left-6 z-40 lg:hidden w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-stone-900/30 transition-all duration-300 hover:scale-110"
          aria-label="Open AI assistant"
        >
          <Bot size={22} />
        </button>
      )}

      {/* Mobile Chat Drawer */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setChatOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl flex flex-col" style={{ height: '80vh' }}>
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-medium">AI Support Assistant</p>
                  <p className="text-[10px] text-stone-400">Online</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-stone-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-xl text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-stone-900 text-white rounded-br-sm'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={12} className="text-stone-600" />
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {messages.length <= 2 && (
              <div className="px-5 pb-2 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] px-3 py-1.5 border border-stone-200 rounded-full text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleChatSubmit} className="px-5 py-4 border-t border-stone-200 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 min-w-0 border border-stone-200 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-none focus:border-stone-400 transition-colors rounded-lg"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || chatLoading}
                className="w-10 h-10 bg-stone-900 text-white rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
