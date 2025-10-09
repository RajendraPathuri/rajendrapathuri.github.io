import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Github, Linkedin, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  const profileImage = PlaceHolderImages.find(p => p.id === 'profile');

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
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">John Doe</h1>
          <p className="mt-2 text-xl text-muted-foreground">Full-Stack Developer & Tech Enthusiast</p>
          <p className="mt-4 max-w-lg">
            Welcome to my digital space. I'm a passionate developer with a knack for building elegant and efficient solutions. I specialize in modern web technologies and love to explore the intersection of code and creativity.
          </p>
          <div className="mt-6 flex justify-center md:justify-start gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="GitHub">
                <Github className="h-6 w-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Medium">
                <Book className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
