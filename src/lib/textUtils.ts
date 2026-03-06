export function parseAchievements(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-*] ?/, '').trim())
    .filter(Boolean);
}

export type InlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'code'; value: string };

export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ kind: 'text', value: text.slice(last, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('`')) {
      segments.push({ kind: 'code', value: raw.slice(1, -1) });
    } else {
      segments.push({ kind: 'bold', value: raw.slice(2, -2) });
    }
    last = match.index + raw.length;
  }
  if (last < text.length) {
    segments.push({ kind: 'text', value: text.slice(last) });
  }
  return segments;
}

export type ParsedLine =
  | { type: 'heading'; text: string; level: 2 | 3 }
  | { type: 'bullet'; segments: InlineSegment[] }
  | { type: 'paragraph'; segments: InlineSegment[] };

export function parseMarkdown(text: string): ParsedLine[] {
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line): ParsedLine => {
      if (line.startsWith('### ')) return { type: 'heading', text: line.slice(4), level: 3 };
      if (line.startsWith('## ')) return { type: 'heading', text: line.slice(3), level: 2 };
      if (line.startsWith('- ')) return { type: 'bullet', segments: parseInline(line.slice(2)) };
      return { type: 'paragraph', segments: parseInline(line) };
    });
}
