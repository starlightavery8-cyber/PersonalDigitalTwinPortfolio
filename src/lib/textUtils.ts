export function parseAchievements(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^[-*] ?/, '').trim())
    .filter(Boolean);
}

export type ParsedLine =
  | { type: 'heading'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'paragraph'; text: string };

export function parseMarkdown(text: string): ParsedLine[] {
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line): ParsedLine => {
      if (line.startsWith('## ')) return { type: 'heading', text: line.replace('## ', '') };
      if (line.startsWith('- ')) return { type: 'bullet', text: line.replace('- ', '') };
      return { type: 'paragraph', text: line };
    });
}
