import { getNoteContent, getNotesTree } from '@/lib/notes';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const tree = getNotesTree();
  const paths: { slug: string[] }[] = [];

  function flattenTree(node: any, currentPath: string[] = []) {
    if (node.path) {
      const slug = node.path.replace(/^notes\/?/, '').replace(/\.md$/, '').split('/');
      if (slug.length > 0 && slug[0] !== '') {
        paths.push({ slug });
      }
    }
    if (node.children) {
      node.children.forEach((child: any) => flattenTree(child, currentPath.concat(node.name)));
    }
  }

  flattenTree(tree);
  // Add root path for notes
  paths.push({ slug: [] });
  return paths;
}

export default async function NotePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug || [];
  try {
    const note = await getNoteContent(slug);
    return (
      <div className="prose">
        <h1>{note.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
      </div>
    );
  } catch (e) {
    // This will render the layout with a prompt to select a note.
    if (slug.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-center">
                <p className="text-muted-foreground">Select a note from the sidebar to get started.</p>
            </div>
        )
    }
    notFound();
  }
}
