import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

interface ChatState {
  step: 'greeting' | 'name' | 'email' | 'phone' | 'business' | 'conversation';
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  businessInfo?: string;
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
  const [chatState, setChatState] = useState<ChatState>({ step: 'greeting' });
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
      // Still show greeting even if DB insert fails
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

  const addMessage = async (role: 'user' | 'assistant', message: string, convId: string) => {
    const tempId = `temp_${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      role,
      message,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    if (convId && !convId.startsWith('conv_')) {
      const { data } = await supabase
        .from('chat_messages')
        .insert({ conversation_id: convId, role, message })
        .select()
        .maybeSingle();

      if (data) {
        setMessages((prev) => prev.map((msg) => (msg.id === tempId ? data : msg)));
      }
    }
  };

  const extractName = (input: string): string => {
    const cleanInput = input.trim();

    const namePatterns = [
      /(?:my name is|i'm|im|i am|this is|call me)\s+([a-z]+)/i,
      /^([a-z]+)$/i,
      /^([a-z]+\s+[a-z]+)$/i,
    ];

    for (const pattern of namePatterns) {
      const match = cleanInput.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return cleanInput;
  };

  const extractEmail = (input: string): string => {
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = input.match(emailPattern);
    return match ? match[1] : input.trim();
  };

  const extractPhone = (input: string): string => {
    const phonePattern = /([\d\s()+-]+)/;
    const match = input.match(phonePattern);
    if (match) {
      return match[1].replace(/\s+/g, ' ').trim();
    }
    return input.trim();
  };

  const capitalizeWords = (str: string): string => {
    return str.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getNextResponse = (currentStep: string, userInput: string): { response: string; nextStep: ChatState['step']; updateData?: any } => {
    switch (currentStep) {
      case 'greeting': {
        const extractedName = extractName(userInput);
        const formattedName = capitalizeWords(extractedName);
        return {
          response: `Nice to meet you, ${formattedName}! What's the best email to reach you?`,
          nextStep: 'email',
          updateData: { visitor_name: formattedName },
        };
      }
      case 'name': {
        const extractedName = extractName(userInput);
        const formattedName = capitalizeWords(extractedName);
        return {
          response: `Thanks, ${formattedName}! What's your email address?`,
          nextStep: 'email',
          updateData: { visitor_name: formattedName },
        };
      }
      case 'email': {
        const extractedEmail = extractEmail(userInput);
        return {
          response: `Perfect! And what's a good phone number to contact you?`,
          nextStep: 'phone',
          updateData: { visitor_email: extractedEmail },
        };
      }
      case 'phone': {
        const extractedPhone = extractPhone(userInput);
        return {
          response: `Great! Tell me a bit about your business and what challenges you're facing with marketing or lead generation.`,
          nextStep: 'business',
          updateData: { visitor_phone: extractedPhone },
        };
      }
      case 'business':
        return {
          response: `Thanks for sharing! Based on what you've told me, I think our AI-powered lead generation and paid traffic solutions could be a perfect fit for you. We specialize in:\n\n• High-converting website creation with smart chatbots\n• AI-powered lead generation campaigns\n• Social media growth strategies\n\nWould you like to schedule a free 30-minute strategy call with our team to discuss how we can help you achieve 3-5x ROI growth?`,
          nextStep: 'conversation',
          updateData: { business_info: userInput, lead_qualified: true },
        };
      default:
        return {
          response: `That's a great question! Our team would love to discuss this with you in detail during a strategy call. In the meantime, feel free to explore our services on this page, or let me know if you have any other questions!`,
          nextStep: 'conversation',
        };
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !conversationId) return;

    const userMessage = inputValue.trim();
    const convId = conversationId;
    setInputValue('');
    setIsLoading(true);

    await addMessage('user', userMessage, convId);

    setTimeout(async () => {
      const { response, nextStep, updateData } = getNextResponse(chatState.step, userMessage);

      if (updateData && !convId.startsWith('conv_')) {
        await supabase
          .from('chat_conversations')
          .update(updateData)
          .eq('id', convId);
      }

      await addMessage('assistant', response, convId);
      setChatState((prev) => ({ ...prev, step: nextStep }));
      setIsLoading(false);
    }, 1000);
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
