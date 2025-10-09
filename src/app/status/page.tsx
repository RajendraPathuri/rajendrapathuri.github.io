import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Rocket, BookOpen, Coffee } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Current Status
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          What I'm currently working on, learning, and my availability.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Currently Building</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>I am deep in development on a new SaaS platform aimed at improving team collaboration. Using a stack of Next.js, FastAPI, and a sprinkle of machine learning for smart features.</p>
          </CardContent>
        </Card>

        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Currently Learning</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>My focus is on mastering advanced concepts in distributed systems and exploring the Rust programming language for high-performance backend services.</p>
          </CardContent>
        </Card>

        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <Coffee className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Availability</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl font-semibold text-accent">Open to Opportunities</p>
            <p className="text-sm text-muted-foreground mt-2">I am actively looking for new and exciting freelance projects or full-time roles. Feel free to reach out!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
