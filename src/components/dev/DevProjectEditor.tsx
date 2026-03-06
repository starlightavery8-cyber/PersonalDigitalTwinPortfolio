import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Project } from '../../lib/types';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="font-mono text-[10px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 font-mono text-xs bg-white border border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35] text-[#1A1A1A]";
const textareaCls = `${inputCls} resize-none`;

function ProjectRow({ project, onSave, onDelete }: {
  project: Project;
  onSave: (p: Project) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Project>(project);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDraft(project); }, [project]);

  const set = (key: keyof Project, val: unknown) => setDraft(d => ({ ...d, [key]: val }));
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
        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#FF6B35] text-white">{draft.category.slice(0, 2).toUpperCase()}</span>
        <span className="font-mono text-sm font-bold text-[#1A1A1A] flex-1 truncate">{draft.title}</span>
        <span className="font-mono text-[10px] text-[#1A1A1A]/40">#{draft.sort_order}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#1A1A1A]/10 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title (EN)">
              <input className={inputCls} value={draft.title} onChange={e => set('title', e.target.value)} />
            </Field>
            <Field label="Title (ZH)">
              <input className={inputCls} value={draft.translations?.zh?.title ?? ''} onChange={e => setZh('title', e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Category">
              <select className={inputCls} value={draft.category} onChange={e => set('category', e.target.value as Project['category'])}>
                <option value="AI Agents">AI Agents</option>
                <option value="Hardware">Hardware</option>
                <option value="Spatial Design">Spatial Design</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input type="number" className={inputCls} value={draft.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </Field>
            <Field label="Featured">
              <select className={inputCls} value={draft.is_featured ? 'true' : 'false'} onChange={e => set('is_featured', e.target.value === 'true')}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </Field>
          </div>

          <Field label="Description (EN)">
            <textarea className={textareaCls} rows={3} value={draft.description} onChange={e => set('description', e.target.value)} />
          </Field>
          <Field label="Description (ZH)">
            <textarea className={textareaCls} rows={3} value={draft.translations?.zh?.description ?? ''} onChange={e => setZh('description', e.target.value)} />
          </Field>

          <Field label="Long Description (EN) — markdown supported">
            <textarea className={textareaCls} rows={8} value={draft.long_description ?? ''} onChange={e => set('long_description', e.target.value)} />
          </Field>
          <Field label="Long Description (ZH)">
            <textarea className={textareaCls} rows={8} value={draft.translations?.zh?.long_description ?? ''} onChange={e => setZh('long_description', e.target.value)} />
          </Field>

          <Field label="Tech Tags (comma-separated)">
            <input className={inputCls} value={(draft.tech_tags ?? []).join(', ')} onChange={e => set('tech_tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
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
              onClick={() => onDelete(project.id)}
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

export default function DevProjectEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects((data as Project[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (p: Project) => {
    const { id, created_at, ...rest } = p;
    await supabase.from('projects').update(rest).eq('id', id);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    await load();
  };

  const handleNew = async () => {
    const maxOrder = Math.max(...projects.map(p => p.sort_order), 0) + 1;
    await supabase.from('projects').insert({
      title: 'New Project',
      category: 'AI Agents',
      description: '',
      long_description: '',
      logic_map: null,
      media_urls: [],
      impact_stats: [],
      tech_tags: [],
      is_featured: false,
      sort_order: maxOrder,
      translations: null,
    });
    await load();
  };

  if (loading) return <div className="font-mono text-xs text-[#1A1A1A]/40 p-4">Loading projects...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-[#1A1A1A]/50">{projects.length} projects</p>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold bg-[#FFD60A] border border-[#1A1A1A] hover:bg-[#FF6B35] hover:text-white transition-colors"
        >
          <Plus size={12} />
          NEW PROJECT
        </button>
      </div>
      {projects.map(p => (
        <ProjectRow key={p.id} project={p} onSave={handleSave} onDelete={handleDelete} />
      ))}
    </div>
  );
}
