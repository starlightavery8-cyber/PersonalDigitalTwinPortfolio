import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RotateCcw, Bot, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useChat } from '../hooks/useChat';

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#FF6B35]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function FloatingChat() {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const welcomeMsg = t('chat.welcome');

  const { messages, loading, error, sendMessage, clearMessages } = useChat(welcomeMsg);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  }, [input, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleClear = useCallback(() => {
    clearMessages(t('chat.welcome'));
  }, [clearMessages, t]);

  const suggestedQuestions = locale === 'zh'
    ? ['你做过哪些AI项目？', '你的技术栈是什么？', '你有建筑背景吗？']
    : ['What AI projects have you built?', 'What\'s your tech stack?', 'Tell me about your architecture background.'];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[400px] flex flex-col"
            style={{ height: 'min(600px, calc(100vh - 120px))' }}
          >
            <div className="flex flex-col h-full border-2 border-[#1A1A1A] bg-[#F5F0E8] shadow-[6px_6px_0px_#1A1A1A]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b-2 border-[#1A1A1A] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35] border-2 border-[#F5F0E8] flex items-center justify-center">
                      <Bot size={16} strokeWidth={2.5} className="text-[#F5F0E8]" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00D4AA] border-2 border-[#1A1A1A]" />
                  </div>
                  <div>
                    <div className="font-mono font-black text-sm text-[#F5F0E8] leading-none">
                      {t('chat.headerTitle')}
                    </div>
                    <div className="font-mono text-[10px] text-[#F5F0E8]/50 mt-0.5">
                      {t('chat.headerSub')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    title={t('chat.clearChat')}
                    className="p-1.5 text-[#F5F0E8]/40 hover:text-[#FFD60A] transition-colors"
                  >
                    <RotateCcw size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 text-[#F5F0E8]/40 hover:text-[#FF6B35] transition-colors"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-[#FF6B35] border-2 border-[#1A1A1A] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <Bot size={12} strokeWidth={2.5} className="text-[#F5F0E8]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3 py-2 border-2 border-[#1A1A1A] font-sans text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#1A1A1A] text-[#F5F0E8] shadow-[2px_2px_0px_#FF6B35]'
                          : 'bg-[#F5F0E8] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-[#FF6B35] border-2 border-[#1A1A1A] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot size={12} strokeWidth={2.5} className="text-[#F5F0E8]" />
                    </div>
                    <div className="border-2 border-[#1A1A1A] bg-[#F5F0E8] shadow-[2px_2px_0px_#1A1A1A]">
                      <TypingDots />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2 border-2 border-[#FF6B35] bg-[#FF6B35]/10">
                    <AlertCircle size={14} className="text-[#FF6B35] flex-shrink-0" strokeWidth={2} />
                    <span className="font-mono text-xs text-[#FF6B35]">{t('chat.errorMsg')}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 1 && !loading && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5 flex-shrink-0">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-2.5 py-1 border border-[#1A1A1A]/30 font-mono text-[10px] text-[#1A1A1A]/70 hover:bg-[#FFD60A] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all duration-150"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t-2 border-[#1A1A1A] px-3 py-3 bg-[#F5F0E8] flex-shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chat.placeholder')}
                    rows={1}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border-2 border-[#1A1A1A] bg-[#F5F0E8] font-mono text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#FF6B35] transition-colors resize-none min-h-[40px] max-h-[120px] disabled:opacity-60"
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = 'auto';
                      t.style.height = Math.min(t.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="p-2.5 bg-[#1A1A1A] border-2 border-[#1A1A1A] text-[#F5F0E8] hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {loading
                      ? <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                      : <Send size={16} strokeWidth={2.5} />
                    }
                  </button>
                </div>
                <div className="mt-1.5 font-mono text-[9px] text-[#1A1A1A]/30 text-center">
                  {t('chat.poweredBy')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-5 right-4 md:right-6 z-50 group"
        aria-label={t('chat.bubbleLabel')}
      >
        <div className="relative">
          {!open && (
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00D4AA] border-2 border-[#F5F0E8] z-10"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <div className={`w-14 h-14 border-2 border-[#1A1A1A] flex items-center justify-center transition-all duration-150 shadow-[4px_4px_0px_#1A1A1A] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 ${open ? 'bg-[#1A1A1A]' : 'bg-[#FF6B35]'}`}>
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} strokeWidth={2.5} className="text-[#F5F0E8]" />
                </motion.span>
              ) : (
                <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <MessageCircle size={22} strokeWidth={2.5} className="text-[#F5F0E8]" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>
    </>
  );
}
