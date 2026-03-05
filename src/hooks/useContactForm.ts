import { useState } from 'react';
import { supabase } from '../lib/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMPTY_FORM = { name: '', email: '', message: '' };

export function useContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');

    const { error } = await supabase.from('contacts').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm(EMPTY_FORM);
    }
  }

  function reset() {
    setStatus('idle');
  }

  return { form, status, handleChange, handleSubmit, reset };
}
