import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

const certifications = [
  {
    title: "Certified Next.js Developer",
    issuer: "Vercel",
    date: "2023",
    skills: ["Next.js", "React", "Server Components", "Performance"],
  },
  {
    title: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    date: "2022",
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "VPC"],
  },
  {
    title: "TypeScript for Professionals",
    issuer: "CodeAcademy",
    date: "2021",
    skills: ["TypeScript", "Static Typing", "Advanced Types"],
  },
  {
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "The Linux Foundation",
    date: "2020",
    skills: ["Kubernetes", "Docker", "Microservices", "CI/CD"],
  },
];

export default function CertificationsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Certifications & Awards
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A testament to my commitment to continuous learning and growth.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {certifications.map((cert, index) => (
          <Card key={index} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-headline text-xl">{cert.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-semibold">{cert.issuer} - <span className="font-normal">{cert.date}</span></p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
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
