import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Project Alpha",
    description: "A full-stack e-commerce platform with a custom CMS, built for scalability and performance. Features real-time inventory management and a personalized recommendation engine.",
    image: PlaceHolderImages.find(p => p.id === 'project1'),
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    title: "Project Beta",
    description: "A data visualization dashboard that tracks and analyzes user engagement metrics. Built with D3.js and React for interactive and dynamic charts.",
    image: PlaceHolderImages.find(p => p.id === 'project2'),
    tags: ["React", "D3.js", "Node.js", "WebSocket"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    title: "Project Gamma",
    description: "A serverless-powered blog platform with markdown support and static site generation for optimal speed and security. Deployed on AWS with Lambda and S3.",
    image: PlaceHolderImages.find(p => p.id === 'project3'),
    tags: ["Gatsby", "GraphQL", "Serverless", "AWS"],
    liveUrl: "#",
    repoUrl: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          My Projects
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A selection of projects I've worked on.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={index} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            {project.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={project.image.imageUrl}
                  alt={project.image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={project.image.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
