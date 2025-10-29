"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NoteEntry } from "@/lib/notes";

interface NotesSidebarProps {
  notes: NoteEntry[];
  level?: number;
}

export default function NotesSidebar({ notes, level = 0 }: NotesSidebarProps) {
  const pathname = usePathname();

  const sortedNotes = notes.sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-2">
      {sortedNotes.map((item) => {
        const itemPath = '/' + item.path.replace(/\.md$/, '');
        const isActive = pathname === itemPath;

        if (item.type === "directory") {
          return (
            <Collapsible key={item.path} defaultOpen={pathname.startsWith(itemPath)}>
              <CollapsibleTrigger className="flex items-center w-full text-left">
                <div 
                  className={cn("flex items-center gap-2 p-2 rounded-md transition-colors w-full", 
                  "hover:bg-muted"
                  )}
                  style={{ paddingLeft: `${(level * 1) + 0.5}rem` }}
                >
                  <ChevronRight className="h-4 w-4 transform transition-transform duration-200 [&[data-state=open]]:-rotate-90"/>
                  <span className="font-semibold">{item.name}</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <NotesSidebar notes={item.children || []} level={level + 1} />
              </CollapsibleContent>
            </Collapsible>
          );
        }

        const displayName = item.name.replace(/\.md$/, '');
        return (
          <Link
            key={item.path}
            href={itemPath}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md transition-colors",
              isActive ? "bg-primary/20 text-primary" : "hover:bg-muted"
            )}
            style={{ paddingLeft: `${(level * 1) + 0.5}rem` }}
          >
            <FileText className="h-4 w-4" />
            <span>{displayName}</span>
          </Link>
        );
      })}
    </div>
  );
}
