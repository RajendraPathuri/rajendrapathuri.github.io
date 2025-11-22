"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudLightning, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "About Me" },
  { href: "/certifications", label: "Certifications" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive =
      href === "/" ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          "transition-all relative text-lg md:text-sm px-2 py-1 rounded-md",
          "hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(var(--primary),0.5)]",
          isActive ? "text-primary font-bold shadow-[0_0_15px_rgba(var(--primary),0.6)]" : "text-muted-foreground"
        )}
      >
        {label}
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_var(--primary)] hidden md:block animate-pulse"></span>
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CloudLightning className="h-6 w-6 text-primary" />
          <span className="font-cyber text-xl font-bold text-primary">
            x0vrpp
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <div className="flex items-center md:hidden gap-4">
            <ModeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <SheetDescription className="sr-only">A list of navigation links.</SheetDescription>
                </SheetHeader>
                <Link href="/" className="mr-6 flex items-center gap-2 mb-8">
                  <CloudLightning className="h-6 w-6 text-primary" />
                  <span className="font-cyber text-xl font-bold text-primary">
                    x0vrpp
                  </span>
                </Link>
                <div className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
