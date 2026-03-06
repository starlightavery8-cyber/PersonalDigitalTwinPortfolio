import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Skill } from '../../lib/types';


function SkillRow({ skill, onSave, onDelete }: {
  skill: Skill;
  onSave: (s: Skill) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Skill>(skill);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDraft(skill); }, [skill]);

  const set = (key: keyof Skill, val: unknown) => setDraft(d => ({ ...d, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categoryColor: Record<string, string> = {
    Build: 'bg-[#FF6B35]',
    Think: 'bg-[#00D4AA]',
    Connect: 'bg-[#FFD60A] text-[#1A1A1A]',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-[#1A1A1A]/15 hover:border-[#1A1A1A]/30 transition-colors">
      <span className={`flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 text-white ${categoryColor[draft.category] ?? 'bg-gray-400'}`}>
        {draft.category.slice(0, 1)}
      </span>

      <input
        className="flex-1 px-2 py-1 font-mono text-xs bg-transparent border-b border-transparent hover:border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35] text-[#1A1A1A] font-bold"
        value={draft.name}
        onChange={e => set('name', e.target.value)}
        placeholder="Skill name (EN)"
      />
      <input
        className="flex-1 px-2 py-1 font-mono text-xs bg-transparent border-b border-transparent hover:border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35] text-[#1A1A1A]/60"
        value={draft.translations?.zh?.name ?? ''}
        onChange={e => set('translations', { zh: { name: e.target.value } })}
        placeholder="中文名称"
      />

      <select
        className="px-2 py-1 font-mono text-xs bg-white border border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35]"
        value={draft.category}
        onChange={e => set('category', e.target.value as Skill['category'])}
      >
        <option value="Build">Build</option>
        <option value="Think">Think</option>
        <option value="Connect">Connect</option>
      </select>

      <input
        type="number"
        min={1}
        max={100}
        className="w-16 px-2 py-1 font-mono text-xs bg-white border border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35]"
        value={draft.level}
        onChange={e => set('level', Number(e.target.value))}
        title="Level (1-100)"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        title="Save"
        className="p-1.5 font-mono text-xs font-bold text-[#1A1A1A] bg-[#FFD60A] border border-[#1A1A1A] hover:bg-[#FF6B35] hover:text-white disabled:opacity-50 transition-colors"
      >
        <Save size={11} />
      </button>
      <button
        onClick={() => onDelete(skill.id)}
        title="Delete"
        className="p-1.5 text-red-400 border border-red-200 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={11} />
      </button>

      {saved && <span className="font-mono text-[10px] text-green-600">✓</span>}
    </div>
  );
}

export default function DevSkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('level', { ascending: false });
    setSkills((data as Skill[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (s: Skill) => {
    const { id, created_at: _c, ...rest } = s;
    await supabase.from('skills').update(rest as never).eq('id', id);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await supabase.from('skills').delete().eq('id', id);
    await load();
  };

  const handleNew = async () => {
    const newSkill = {
      name: 'New Skill',
      level: 50,
      category: 'Build' as const,
      icon_slug: 'code',
      translations: null,
    };
    await supabase.from('skills').insert(newSkill as never);
    await load();
  };

  if (loading) return <div className="font-mono text-xs text-[#1A1A1A]/40 p-4">Loading skills...</div>;

  const groups: Record<string, Skill[]> = { Build: [], Think: [], Connect: [] };
  skills.forEach(s => { groups[s.category]?.push(s); });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-[#1A1A1A]/50">{skills.length} skills — inline edit, click Save per row</p>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold bg-[#FFD60A] border border-[#1A1A1A] hover:bg-[#FF6B35] hover:text-white transition-colors"
        >
          <Plus size={12} />
          NEW SKILL
        </button>
      </div>

      {Object.entries(groups).map(([cat, items]) => items.length > 0 && (
        <div key={cat}>
          <p className="font-mono text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mb-2">{cat}</p>
          <div className="space-y-1.5">
            {items.map(s => (
              <SkillRow key={s.id} skill={s} onSave={handleSave} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
