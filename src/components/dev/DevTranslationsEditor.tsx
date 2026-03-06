import { useState, useMemo } from 'react';
import { Save, Search } from 'lucide-react';
import { translations as defaultTranslations } from '../../lib/translations';
import type { Locale } from '../../lib/i18n';

const STORAGE_KEY = 'dev_translations_overrides';

function loadOverrides(): Record<string, Record<string, string>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(data: Record<string, Record<string, string>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function flattenObj(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenObj(val as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(val ?? '');
    }
  }
  return result;
}

export default function DevTranslationsEditor() {
  const [locale, setLocale] = useState<Locale>('en');
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>(loadOverrides);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const flat = useMemo(() =>
    flattenObj(defaultTranslations[locale] as Record<string, unknown>),
    [locale]
  );

  const localeOverrides = overrides[locale] ?? {};

  const keys = useMemo(() => {
    const allKeys = Object.keys(flat);
    if (!search.trim()) return allKeys;
    const q = search.toLowerCase();
    return allKeys.filter(k => k.toLowerCase().includes(q) || flat[k].toLowerCase().includes(q));
  }, [flat, search]);

  const handleChange = (key: string, val: string) => {
    setOverrides(prev => ({
      ...prev,
      [locale]: { ...(prev[locale] ?? {}), [key]: val },
    }));
  };

  const handleSave = (key: string) => {
    const updated = {
      ...overrides,
      [locale]: { ...(overrides[locale] ?? {}), [key]: localeOverrides[key] ?? flat[key] },
    };
    saveOverrides(updated);
    setSaved(s => ({ ...s, [key]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 1500);
  };

  const handleSaveAll = () => {
    saveOverrides(overrides);
    const allSaved: Record<string, boolean> = {};
    keys.forEach(k => { allSaved[k] = true; });
    setSaved(allSaved);
    setTimeout(() => setSaved({}), 2000);
  };

  const getValue = (key: string) => localeOverrides[key] ?? flat[key] ?? '';

  return (
    <div className="space-y-4">
      <div className="p-3 bg-[#FFD60A]/20 border border-[#FFD60A] font-mono text-[10px] text-[#1A1A1A]/70">
        Changes are saved to localStorage and take effect on next page load. These override the default translations file without modifying code.
      </div>

      <div className="flex items-center gap-3">
        <div className="flex border border-[#1A1A1A]/20 overflow-hidden">
          {(['en', 'zh'] as Locale[]).map(l => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-4 py-1.5 font-mono text-xs font-bold transition-colors ${locale === l ? 'bg-[#1A1A1A] text-[#FFD60A]' : 'bg-white text-[#1A1A1A] hover:bg-[#F5F0E8]'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
          <input
            className="w-full pl-8 pr-3 py-1.5 font-mono text-xs bg-white border border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35]"
            placeholder="Search keys or values..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold bg-[#1A1A1A] text-[#FFD60A] hover:bg-[#FF6B35] hover:text-white transition-colors"
        >
          <Save size={11} />
          SAVE ALL
        </button>
      </div>

      <div className="space-y-1.5">
        {keys.map(key => {
          const isModified = localeOverrides[key] !== undefined && localeOverrides[key] !== flat[key];
          return (
            <div key={key} className={`flex items-start gap-3 p-2.5 border ${isModified ? 'border-[#FF6B35]/40 bg-[#FF6B35]/5' : 'border-[#1A1A1A]/10 bg-white'}`}>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-[#1A1A1A]/40 mb-1 truncate">{key}</p>
                <textarea
                  rows={getValue(key).length > 80 ? 3 : 1}
                  className="w-full px-2 py-1 font-mono text-xs bg-transparent border border-transparent hover:border-[#1A1A1A]/20 focus:outline-none focus:border-[#FF6B35] text-[#1A1A1A] resize-none"
                  value={getValue(key)}
                  onChange={e => handleChange(key, e.target.value)}
                />
              </div>
              <button
                onClick={() => handleSave(key)}
                className="flex-shrink-0 mt-4 p-1.5 font-mono text-[10px] font-bold text-[#1A1A1A] bg-[#FFD60A] border border-[#1A1A1A]/30 hover:bg-[#FF6B35] hover:text-white transition-colors"
              >
                {saved[key] ? '✓' : <Save size={10} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
