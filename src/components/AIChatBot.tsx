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

      console.log('SUPABASE RESPONSE:', { data, error });

      if (error) {
        console.warn('SUPABASE ERROR:', error);
      }

      const botResponse =
        data?.reply ||
        data?.response ||
        data?.data?.reply ||
        error?.message ||
        "I'm having trouble responding. Please try again.";

      addMessage('bot', botResponse);
    } catch (err) {
      console.error('CHAT FUNCTION FAILED:', err);

      addMessage(
        'bot',
        'Sorry, I encountered an error. Please try again or contact support on WhatsApp.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* YOUR CHAT UI GOES HERE */}
    </div>
  );
}