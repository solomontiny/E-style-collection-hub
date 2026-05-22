const handleSendMessage = async (text?: string) => {
  const messageText = text || input.trim();

  if (!messageText || loading) return;

  setInput('');
  addMessage('user', messageText);
  setLoading(true);

  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        message: messageText,
      },
    });

    console.log("SUPABASE RESPONSE:", { data, error });

    if (error) {
      throw error;
    }

    const botResponse =
      data?.reply ||
      data?.response ||
      "I'm having trouble responding. Please try again.";

    addMessage('bot', botResponse);
  } catch (error) {
    console.error('Chatbot error:', error);

    addMessage(
      'bot',
      'Sorry, I encountered an error. Please try again or contact support on WhatsApp.'
    );
  } finally {
    setLoading(false);
  }
};