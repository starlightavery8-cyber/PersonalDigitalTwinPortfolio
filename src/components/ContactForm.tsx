import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useContactForm } from '../hooks/useContactForm';
import { useTranslation } from '../hooks/useTranslation';
import SectionHeader from './SectionHeader';

export default function ContactForm() {
  const { form, status, handleChange, handleSubmit, reset } = useContactForm();
  const { t } = useTranslation();

  const infoItems = [
    { label: t('contact.locationLabel'), value: t('contact.locationValue') },
    { label: t('contact.responseLabel'), value: t('contact.responseValue') },
    { label: t('contact.availLabel'), value: t('contact.availValue') },
  ];

  return (
    <section id="contact" className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader badge={t('contact.sectionBadge')} title={t('contact.sectionTitle')} className="mb-6" />

          <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mb-8">
            {t('contact.description')}
          </p>

          <div className="space-y-3">
            {infoItems.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4 p-3 border-2 border-[#1A1A1A] bg-[#F5F0E8]">
                <span className="font-mono text-xs font-bold text-[#1A1A1A]/50 w-32 flex-shrink-0">{label}</span>
                <span className="font-mono text-sm font-bold text-[#1A1A1A]">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {status === 'success' ? (
            <div className="border-2 border-[#1A1A1A] bg-[#00D4AA] shadow-[4px_4px_0px_#1A1A1A] p-8 flex flex-col items-center text-center gap-4">
              <CheckCircle size={40} strokeWidth={2} className="text-[#1A1A1A]" />
              <div className="font-mono font-black text-xl text-[#1A1A1A]">{t('contact.successTitle')}</div>
              <p className="font-sans text-sm text-[#1A1A1A]/70">
                {t('contact.successBody')}
              </p>
              <button
                onClick={reset}
                className="mt-2 px-4 py-2 border-2 border-[#1A1A1A] font-mono text-sm font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F0E8] transition-colors"
              >
                {t('contact.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border-2 border-[#1A1A1A] bg-[#F5F0E8] shadow-[4px_4px_0px_#1A1A1A]">
              <div className="px-6 py-4 border-b-2 border-[#1A1A1A] bg-[#1A1A1A] font-mono text-xs text-[#F5F0E8]/60">
                {t('contact.formComment')}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-[#1A1A1A]/60 mb-1.5">
                    {t('contact.nameLabel')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] bg-[#F5F0E8] font-mono text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#FF6B35] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-[#1A1A1A]/60 mb-1.5">
                    {t('contact.emailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] bg-[#F5F0E8] font-mono text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#FF6B35] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-[#1A1A1A]/60 mb-1.5">
                    {t('contact.messageLabel')}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={t('contact.messagePlaceholder')}
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] bg-[#F5F0E8] font-mono text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#FF6B35] transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 border-2 border-[#FF6B35] bg-[#FF6B35]/10">
                    <AlertCircle size={16} className="text-[#FF6B35]" strokeWidth={2} />
                    <span className="font-mono text-xs text-[#FF6B35]">{t('contact.errorMsg')}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-[#F5F0E8] font-mono font-bold text-sm border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#FF6B35] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    t('contact.sending')
                  ) : (
                    <>
                      <Send size={14} strokeWidth={2.5} />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
