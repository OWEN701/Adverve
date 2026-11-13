import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  message: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MAX_MESSAGE_CHARS = 1000;
const GREETING =
  "Hi! I'm Adbot, Adverve's AI assistant. I'd love to learn more about your business and see how we can help you grow. What's your name?";
const FALLBACK =
  'Sorry, I had trouble connecting just now. Could you try again, or book a call in the section below, or email owen@adverve.io?';

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

function getSessionId(): string {
  try {
    const stored = localStorage.getItem('adverve_session_id');
    if (stored) return stored;
    const created = `session_${newId()}`;
    localStorage.setItem('adverve_session_id', created);
    return created;
  } catch {
    return `session_${newId()}`;
  }
}

async function callChat(body: Record<string, unknown>) {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(getSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const addMessage = (role: Message['role'], message: string) => {
    setMessages((prev) => [...prev, { id: newId(), role, message }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Keyboard users: focus the input when the chat opens, return focus to the
  // launcher when it closes, and let Escape close it.
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', onKey);
      wasOpen.current = true;
      return () => window.removeEventListener('keydown', onKey);
    }
    if (wasOpen.current) launcherRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const initializeChat = async () => {
    setMessages([{ id: newId(), role: 'assistant', message: GREETING }]);
    try {
      const { ok, data } = await callChat({ action: 'start', sessionId });
      if (ok && typeof data.conversationId === 'string') {
        setConversationId(data.conversationId);
      }
    } catch {
      // The widget still shows the greeting; sending will retry the start.
    }
  };

  const handleSend = async () => {
    const userMessage = inputValue.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!userMessage || isLoading) return;

    setInputValue('');
    setIsLoading(true);
    addMessage('user', userMessage);

    try {
      let convId = conversationId;
      if (!convId) {
        const started = await callChat({ action: 'start', sessionId });
        if (!started.ok || typeof started.data.conversationId !== 'string') {
          throw new Error('Could not start chat');
        }
        convId = started.data.conversationId as string;
        setConversationId(convId);
      }

      const { data } = await callChat({
        action: 'message',
        sessionId,
        conversationId: convId,
        message: userMessage,
      });
      addMessage('assistant', typeof data.reply === 'string' && data.reply ? data.reply : FALLBACK);
    } catch {
      addMessage('assistant', FALLBACK);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Launcher Bubble */}
      {!isOpen && (
        <button
          ref={launcherRef}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full p-4 shadow-lg shadow-cyan-500/30 transition-all duration-300 transform hover:scale-110 z-50 group"
          aria-label="Open chat with Adbot"
          aria-expanded={false}
          aria-controls="adbot-chat"
        >
          <span className="chat-pulse-ring absolute inset-0 rounded-full bg-cyan-400/40" aria-hidden="true" />
          <MessageCircle className="h-6 w-6 relative z-10" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md ring-2 ring-slate-900" aria-hidden="true">
            1
          </span>
          <span className="absolute bottom-full right-0 mb-3 bg-slate-800 text-slate-100 text-sm px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 shadow-xl border border-slate-700" aria-hidden="true">
            Chat with us!
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          id="adbot-chat"
          role="dialog"
          aria-label="Chat with Adbot"
          className="fixed bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[380px] h-[85vh] sm:h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/40 border border-slate-700 flex flex-col z-50 chat-panel-open overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-2 ring-2 ring-white/20 shadow-md" aria-hidden="true">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-base leading-tight">Adbot</h2>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                  <span className="text-xs text-white/80">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 chat-scrollbar"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-1.5 shadow-md mb-1" aria-hidden="true">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-md'
                      : 'bg-slate-700/80 text-slate-100 rounded-2xl rounded-bl-md'
                  }`}
                >
                  <span className="sr-only">{msg.role === 'user' ? 'You: ' : 'Adbot: '}</span>
                  {msg.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end space-x-2 justify-start">
                <div className="flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-1.5 shadow-md mb-1" aria-hidden="true">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-slate-700/80 rounded-2xl rounded-bl-md px-4 py-3.5 flex items-center space-x-1.5">
                  <span className="sr-only">Adbot is typing</span>
                  <span className="chat-typing-dot w-2 h-2 bg-slate-300 rounded-full" aria-hidden="true" />
                  <span className="chat-typing-dot w-2 h-2 bg-slate-300 rounded-full" aria-hidden="true" />
                  <span className="chat-typing-dot w-2 h-2 bg-slate-300 rounded-full" aria-hidden="true" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <label htmlFor="adbot-input" className="sr-only">Type your message</label>
              <input
                id="adbot-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                maxLength={MAX_MESSAGE_CHARS}
                autoComplete="off"
                className="flex-1 bg-slate-800/90 border border-slate-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
