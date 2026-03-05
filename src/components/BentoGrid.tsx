import { motion } from 'framer-motion';
import { getBentoItems } from '../data/bentoData';
import SectionHeader from './SectionHeader';
import { useTranslation } from '../hooks/useTranslation';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BentoGrid() {
  const { t } = useTranslation();
  const bentoItems = getBentoItems(t);

  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge={t('bento.sectionBadge')} title={t('bento.sectionTitle')} className="mb-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {bentoItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`${item.colSpan} ${item.rowSpan} group`}
            >
              <div
                className="relative h-full min-h-[160px] p-6 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-default"
                style={{ backgroundColor: item.bg, color: item.textColor }}
              >
                {item.content ? (
                  item.content
                ) : (
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      {item.icon && <item.icon size={28} strokeWidth={2} className="mb-3" />}
                      <div className="font-mono text-xs font-bold mb-1 opacity-70">{item.label}</div>
                    </div>
                    <div>
                      <div className="font-mono font-black text-4xl">{item.stat}</div>
                      <div className="font-mono text-xs opacity-60 mt-1">{item.subLabel}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
