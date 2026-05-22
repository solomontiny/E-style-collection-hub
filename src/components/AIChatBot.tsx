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

    // 🔍 DEBUG LOG (IMPORTANT)
    console.log(
      'SUPABASE FULL RESPONSE:',
      JSON.stringify({ data, error }, null, 2)
    );

    if (error) throw error;

    const botResponse =
      data?.reply ??
      data?.response ??
      data?.data?.reply ??
      "I'm having trouble responding. Please try again.";

    addMessage('bot', botResponse);
  } catch (err) {
    // 🔍 FULL ERROR DEBUG (IMPORTANT)
    console.error('CHAT ERROR FULL:', err);

    addMessage(
      'bot',
      'Sorry, I encountered an error. Please try again or contact support on WhatsApp.'
    );
  } finally {
    setLoading(false);
  }
};