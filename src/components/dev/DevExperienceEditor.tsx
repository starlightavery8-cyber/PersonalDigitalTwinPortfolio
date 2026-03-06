import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Experience } from '../../lib/types';

const inputCls = "w-full px-3 py-2 font-mono text-xs bg-white border border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35] text-[#1A1A1A]";
const textareaCls = `${inputCls} resize-none`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="font-mono text-[10px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function ExperienceRow({ exp, onSave, onDelete }: {
  exp: Experience;
  onSave: (e: Experience) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Experience>(exp);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDraft(exp); }, [exp]);

  const set = (key: keyof Experience, val: unknown) => setDraft(d => ({ ...d, [key]: val }));
  const setZh = (key: string, val: string) =>
    setDraft(d => ({
      ...d,
      translations: {
        ...d.translations,
        zh: { ...(d.translations?.zh ?? {}), [key]: val },
      },
    }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="border border-[#1A1A1A]/15 bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F5F0E8] transition-colors"
      >
        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#00D4AA] text-white">{draft.year_start}</span>
        <span className="font-mono text-sm font-bold text-[#1A1A1A] flex-1 truncate">{draft.role} @ {draft.company}</span>
        <span className="font-mono text-[10px] text-[#1A1A1A]/40">{draft.category}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#1A1A1A]/10 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company (EN)">
              <input className={inputCls} value={draft.company} onChange={e => set('company', e.target.value)} />
            </Field>
            <Field label="Company (ZH)">
              <input className={inputCls} value={draft.translations?.zh?.company ?? ''} onChange={e => setZh('company', e.target.value)} />
            </Field>
            <Field label="Role (EN)">
              <input className={inputCls} value={draft.role} onChange={e => set('role', e.target.value)} />
            </Field>
            <Field label="Role (ZH)">
              <input className={inputCls} value={draft.translations?.zh?.role ?? ''} onChange={e => setZh('role', e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Field label="Year Start">
              <input type="number" className={inputCls} value={draft.year_start} onChange={e => set('year_start', Number(e.target.value))} />
            </Field>
            <Field label="Year End">
              <input type="number" className={inputCls} value={draft.year_end ?? ''} placeholder="blank = present" onChange={e => set('year_end', e.target.value ? Number(e.target.value) : null)} />
            </Field>
            <Field label="Location">
              <input className={inputCls} value={draft.location} onChange={e => set('location', e.target.value)} />
            </Field>
            <Field label="Category">
              <select className={inputCls} value={draft.category} onChange={e => set('category', e.target.value as Experience['category'])}>
                <option value="AI_Tech">AI_Tech</option>
                <option value="Architecture">Architecture</option>
                <option value="Education">Education</option>
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-4">
            <Field label="Milestone">
              <select className={inputCls} value={draft.is_milestone ? 'true' : 'false'} onChange={e => set('is_milestone', e.target.value === 'true')}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </Field>
            <Field label="Academic">
              <select className={inputCls} value={draft.is_academic ? 'true' : 'false'} onChange={e => set('is_academic', e.target.value === 'true')}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </Field>
          </div>

          <Field label="Achievements (EN) — use - for bullets">
            <textarea className={textareaCls} rows={6} value={draft.achievements} onChange={e => set('achievements', e.target.value)} />
          </Field>
          <Field label="Achievements (ZH)">
            <textarea className={textareaCls} rows={6} value={draft.translations?.zh?.achievements ?? ''} onChange={e => setZh('achievements', e.target.value)} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold bg-[#1A1A1A] text-[#FFD60A] border border-[#1A1A1A] hover:bg-[#FF6B35] hover:text-white disabled:opacity-50 transition-colors"
            >
              <Save size={12} />
              {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE CHANGES'}
            </button>
            <button
              onClick={() => onDelete(exp.id)}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={12} />
              DELETE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevExperienceEditor() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('experience').select('*').order('year_start', { ascending: false });
    setItems((data as Experience[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: Experience) => {
    const { id, created_at, ...rest } = e;
    await supabase.from('experience').update(rest).eq('id', id);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return;
    await supabase.from('experience').delete().eq('id', id);
    await load();
  };

  const handleNew = async () => {
    await supabase.from('experience').insert({
      company: 'New Company',
      role: 'New Role',
      achievements: '',
      is_academic: false,
      year_start: new Date().getFullYear(),
      year_end: null,
      location: '',
      category: 'AI_Tech',
      is_milestone: false,
      translations: null,
    });
    await load();
  };

  if (loading) return <div className="font-mono text-xs text-[#1A1A1A]/40 p-4">Loading experience...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-[#1A1A1A]/50">{items.length} entries</p>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold bg-[#FFD60A] border border-[#1A1A1A] hover:bg-[#FF6B35] hover:text-white transition-colors"
        >
          <Plus size={12} />
          NEW ENTRY
        </button>
      </div>
      {items.map(e => (
        <ExperienceRow key={e.id} exp={e} onSave={handleSave} onDelete={handleDelete} />
      ))}
    </div>
  );
}
