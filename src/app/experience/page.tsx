import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPageContent } from "@/lib/content";

type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

type ExperienceContent = {
  title: string;
  subtitle: string;
  experiences: Experience[];
};

export default async function ExperiencePage() {
  const pageData = await getPageContent<ExperienceContent>('experience');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          {pageData.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageData.subtitle}
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true"></div>
        <div className="space-y-12">
          {pageData.experiences.map((exp, index) => (
            <div
              key={index}
              className="md:grid md:grid-cols-2 md:gap-8 items-start relative"
            >
              <div className={index % 2 === 0 ? "md:order-2 md:text-left" : "md:order-1 md:text-right"}>
                <p className="text-sm text-muted-foreground font-medium">{exp.period}</p>
              </div>
              <div className={index % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <div className="absolute left-1/2 top-2 w-3 h-3 bg-accent rounded-full -translate-x-1/2 hidden md:block" aria-hidden="true"></div>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{exp.role}</CardTitle>
                    <p className="text-accent font-semibold">{exp.company}</p>
                  </CardHeader>
                  <CardContent>
                    <p>{exp.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
