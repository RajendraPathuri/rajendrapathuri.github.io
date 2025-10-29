import NotesSidebar from "@/components/NotesSidebar";
import { getNotesTree } from "@/lib/notes";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notesTree = getNotesTree();

  return (
    <div className="flex gap-8">
      <aside className="w-1/4">
        <NotesSidebar notes={notesTree.children || []} />
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}