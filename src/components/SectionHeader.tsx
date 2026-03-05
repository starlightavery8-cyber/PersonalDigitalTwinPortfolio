import { motion } from 'framer-motion';

interface Props {
  badge: string;
  title: string;
  dark?: boolean;
  className?: string;
}

export default function SectionHeader({ badge, title, dark = false, className = 'mb-14' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div
        className={`inline-block px-3 py-1 border-2 font-mono text-xs font-bold mb-3 ${
          dark
            ? 'border-[#F5F0E8]/20 text-[#FF6B35]'
            : 'border-[#1A1A1A] text-[#1A1A1A]'
        }`}
      >
        {badge}
      </div>
      <h2
        className={`font-mono font-black text-4xl md:text-5xl ${
          dark ? 'text-[#F5F0E8]' : 'text-[#1A1A1A]'
        }`}
      >
        {title}
      </h2>
    </motion.div>
  );
}
