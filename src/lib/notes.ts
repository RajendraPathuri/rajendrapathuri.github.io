import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type NoteEntry = {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: NoteEntry[];
};

const notesDirectory = path.join(process.cwd(), 'notes');

function readDirectory(dir: string): NoteEntry[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.map((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);
    if (entry.isDirectory()) {
      return {
        path: relativePath,
        name: entry.name,
        type: 'directory',
        children: readDirectory(fullPath),
      };
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      return {
        path: relativePath,
        name: entry.name,
        type: 'file',
      };
    }
    return null;
  }).filter((entry): entry is NoteEntry => entry !== null);
}

export function getNotesTree(): NoteEntry {
  return {
    path: 'notes',
    name: 'notes',
    type: 'directory',
    children: readDirectory(notesDirectory),
  };
}

export async function getNoteContent(slug: string[]): Promise<{ title: string; contentHtml: string }> {
  const filePath = path.join(notesDirectory, ...slug) + '.md';

  if (!fs.existsSync(filePath)) {
    throw new Error(`Note not found at ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  const title = matterResult.data.title || slug[slug.length - 1].replace(/-/g, ' ');

  return {
    title,
    contentHtml,
  };
}
