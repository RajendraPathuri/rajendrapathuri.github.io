import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Github, Linkedin, Book, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getPageContent } from '@/lib/content';
import { TypingEffect } from '@/components/ui/TypingEffect';

type AboutContent = {
  name: string;
  title: string;
  profileImage: string;
  socials: {
    github: string;
    linkedin: string;
    medium: string;
    resume: string;
  }
};

export default async function AboutPage() {
  const pageData = await getPageContent<AboutContent>('about');
  const profileImage = PlaceHolderImages.find(p => p.id === pageData.profileImage);

  return (
    <div className="relative flex items-center justify-center flex-1 h-full overflow-hidden">
      {/* Cyber Background - Removed lines as requested */}
      {/* <div className="absolute inset-0 cyber-grid -z-20 opacity-30" /> */}
      {/* <div className="absolute inset-0 scanline-overlay -z-10 opacity-50" /> */}

      {/* Radial Gradient for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] -z-10" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-5xl mx-auto p-4 sm:p-6 md:p-8 relative z-10">
        {/* Profile Picture - Hidden temporarily
        <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0 group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          {profileImage && (
            <Image
              src={profileImage.imageUrl}
              alt={profileImage.description}
              fill
              sizes="(max-width: 768px) 192px, 256px"
              className="rounded-full object-cover object-[center_20%] shadow-2xl border-2 border-primary/50 relative z-10"
              data-ai-hint={profileImage.imageHint}
              priority
            />
          )}
        </div>
        */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="font-cyber text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-wide">
            {pageData.name}
          </h1>
          <div className="text-lg sm:text-xl text-muted-foreground font-code">
            <span className="text-primary mr-2">{">"}</span>
            <TypingEffect text={pageData.title} speed={50} />
          </div>
          <div className="mt-4 max-w-lg prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />
          <div className="mt-6 flex justify-center md:justify-start gap-4">
            <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_15px_var(--primary)] transition-all duration-300" asChild>
              <Link href={pageData.socials.github} aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_15px_var(--primary)] transition-all duration-300" asChild>
              <Link href={pageData.socials.linkedin} aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_15px_var(--primary)] transition-all duration-300" asChild>
              <Link href={pageData.socials.medium} aria-label="Medium">
                <Book className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_15px_var(--primary)] transition-all duration-300" asChild>
              <Link href={pageData.socials.resume} aria-label="Resume">
                <FileText className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
