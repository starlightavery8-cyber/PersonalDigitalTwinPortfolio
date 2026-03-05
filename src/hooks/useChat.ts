import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SESSION_KEY = 'avery_chat_session_id';

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function useChat(welcomeMessage: string) {
  const sessionId = useRef(getOrCreateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: welcomeMessage },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([{ id: 'welcome', role: 'assistant', content: welcomeMessage }]);
  }, [welcomeMessage]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    const history = [...messages.filter((m) => m.id !== 'welcome'), userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

      const res = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: history, session_id: sessionId.current }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const clearMessages = useCallback((welcomeMsg: string) => {
    setMessages([{ id: 'welcome', role: 'assistant', content: welcomeMsg }]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
