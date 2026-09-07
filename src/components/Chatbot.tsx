import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('adverve_session_id');
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('adverve_session_id', newId);
    return newId;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .insert({ session_id: sessionId })
      .select()
      .maybeSingle();

    if (error || !conversation) {
      const tempId = `conv_${Date.now()}`;
      setConversationId(tempId);
      const greeting = "Hi! I'm Adbot, Adverve's AI assistant. I'd love to learn more about your business and see how we can help you grow. What's your name?";
      setMessages([{ id: `temp_${Date.now()}`, role: 'assistant', message: greeting, created_at: new Date().toISOString() }]);
      return;
    }

    const convId = conversation.id;
    setConversationId(convId);

    const greeting = "Hi! I'm Adbot, Adverve's AI assistant. I'd love to learn more about your business and see how we can help you grow. What's your name?";
    const tempMsg: Message = { id: `temp_${Date.now()}`, role: 'assistant', message: greeting, created_at: new Date().toISOString() };
    setMessages([tempMsg]);

    const { data: savedMsg } = await supabase
      .from('chat_messages')
      .insert({ conversation_id: convId, role: 'assistant', message: greeting })
      .select()
      .maybeSingle();

    if (savedMsg) {
      setMessages([savedMsg]);
    }
  };

  const addMessageToLocal = (role: 'user' | 'assistant', message: string): Message => {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newMessage: Message = {
      id: tempId,
      role,
      message,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const persistMessage = async (role: 'user' | 'assistant', message: string, convId: string, tempId: string) => {
    if (!convId || convId.startsWith('conv_')) return;
    const { data } = await supabase
      .from('chat_messages')
      .insert({ conversation_id: convId, role, message })
      .select()
      .maybeSingle();

    if (data) {
      setMessages((prev) => prev.map((msg) => (msg.id === tempId ? data : msg)));
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !conversationId) return;

    const userMessage = inputValue.trim();
    const convId = conversationId;
    setInputValue('');
    setIsLoading(true);

    const userMsg = addMessageToLocal('user', userMessage);
    persistMessage('user', userMessage, convId, userMsg.id);

    const apiMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.message })),
      { role: 'user' as const, content: userMessage },
    ];

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            conversationId: convId,
            messages: apiMessages,
          }),
        }
      );

      if (!res.ok) throw new Error('Chat request failed');

      const data = await res.json();
      const reply = data.reply || "Sorry, I didn't catch that. Could you try again?";

      const assistantMsg = addMessageToLocal('assistant', reply);
      persistMessage('assistant', reply, convId, assistantMsg.id);
    } catch {
      const fallback = "Sorry, I had trouble connecting just now. Could you try again, or reach out via the contact form below?";
      const assistantMsg = addMessageToLocal('assistant', fallback);
      persistMessage('assistant', fallback, convId, assistantMsg.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full p-4 shadow-2xl shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            1
          </span>
          <span className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
            Chat with us!
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Adbot</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/90">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl px-4 py-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
