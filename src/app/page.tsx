import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  const profileImage = PlaceHolderImages.find(p => p.id === 'profile');

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-48 h-48 md:w-64 md:h-64 relative">
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
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">John Doe</h1>
          <p className="mt-2 text-xl text-muted-foreground">Full-Stack Developer & Tech Enthusiast</p>
          <p className="mt-4 max-w-2xl mx-auto md:mx-0">
            Welcome to my digital space. I'm a passionate developer with a knack for building elegant and efficient solutions. I specialize in modern web technologies and love to explore the intersection of code and creativity.
          </p>
        </div>
      </div>
      
      <Separator />

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Philosophy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            I believe in the power of clean code, user-centric design, and continuous learning. My goal is to not only write functional software but to craft experiences that are intuitive, accessible, and enjoyable. This portfolio is a living document of my journey, showcasing projects I'm proud of and thoughts on the ever-evolving world of technology.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
