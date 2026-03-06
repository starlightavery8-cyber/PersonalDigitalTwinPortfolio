import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock } from 'lucide-react';
import { useDevMode } from '../../hooks/useDevMode';

interface Props {
  onClose: () => void;
}

export default function DevPasswordGate({ onClose }: Props) {
  const { unlock } = useDevMode();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = unlock(password);
    if (!ok) {
      setError(true);
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#1A1A1A]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { opacity: 1, scale: 1 }}
        transition={shake ? { duration: 0.5 } : { duration: 0.2 }}
        className="w-full max-w-sm bg-[#F5F0E8] border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#FF6B35]"
      >
        <div className="px-6 py-4 bg-[#1A1A1A] border-b-2 border-[#1A1A1A] flex items-center gap-3">
          <Terminal size={16} strokeWidth={2.5} className="text-[#FF6B35]" />
          <span className="font-mono text-sm font-bold text-[#F5F0E8]">DEV MODE</span>
          <span className="ml-auto font-mono text-xs text-[#F5F0E8]/40">// restricted access</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Lock size={18} strokeWidth={2} className="text-[#1A1A1A]/40" />
            <p className="font-mono text-sm text-[#1A1A1A]/70">Enter developer password</p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
              className="w-full px-4 py-3 font-mono text-sm bg-[#1A1A1A] text-[#FFD60A] border-2 border-[#1A1A1A] focus:outline-none focus:border-[#FF6B35] placeholder:text-[#F5F0E8]/20 tracking-widest"
              placeholder="••••••"
            />
            {error && (
              <p className="font-mono text-xs text-[#FF6B35]">// incorrect password</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 font-mono text-sm font-bold text-[#1A1A1A] bg-[#FFD60A] border-2 border-[#1A1A1A] hover:bg-[#FF6B35] hover:text-[#F5F0E8] transition-colors"
            >
              UNLOCK
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 font-mono text-sm font-bold text-[#1A1A1A]/60 border-2 border-[#1A1A1A]/30 hover:border-[#1A1A1A] transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
