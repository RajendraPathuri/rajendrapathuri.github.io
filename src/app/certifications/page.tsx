import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { getPageContent } from "@/lib/content";

type Certification = {
  title: string;
  issuer: string;
  date: string;
  skills: string[];
};

type CertificationsContent = {
  title: string;
  subtitle: string;
  certifications: Certification[];
};

export default async function CertificationsPage() {
  const pageData = await getPageContent<CertificationsContent>('certifications');

  return (
    <div className="space-y-8">
      <div className="text-center px-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          {pageData.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
          {pageData.subtitle}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 md:gap-8">
        {pageData.certifications.map((cert, index) => (
          <Card key={index} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-headline text-lg md:text-xl">{cert.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-semibold">{cert.issuer} - <span className="font-normal">{cert.date}</span></p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow pt-0">
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
