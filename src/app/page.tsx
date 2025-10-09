import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Github, Linkedin, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getPageContent } from '@/lib/content';

type AboutContent = {
  name: string;
  title: string;
  profileImage: string;
  socials: {
    github: string;
    linkedin: string;
    medium: string;
  }
};

export default async function AboutPage() {
  const pageData = await getPageContent<AboutContent>('about');
  const profileImage = PlaceHolderImages.find(p => p.id === pageData.profileImage);

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-5xl mx-auto p-4">
        <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0">
          {profileImage && (
            <Image
              src={profileImage.imageUrl}
              alt={profileImage.description}
              width={256}
              height={256}
              className="rounded-full object-cover shadow-lg border-4 border-card"
              data-ai-hint={profileImage.imageHint}
            />
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">{pageData.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{pageData.title}</p>
          <div className="mt-4 max-w-lg prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />
          <div className="mt-6 flex justify-center md:justify-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={pageData.socials.github} aria-label="GitHub">
                <Github className="h-6 w-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={pageData.socials.linkedin} aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={pageData.socials.medium} aria-label="Medium">
                <Book className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
