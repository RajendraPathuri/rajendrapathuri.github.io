import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, BookOpen, Coffee, LucideProps } from "lucide-react";
import { getPageContent } from "@/lib/content";

const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Rocket,
  BookOpen,
  Coffee,
};

type StatusItem = {
  title: string;
  icon: string;
  description: string;
  availability?: string;
};

type StatusContent = {
  title: string;
  subtitle: string;
  status: StatusItem[];
};

export default async function StatusPage() {
  const pageData = await getPageContent<StatusContent>('status');

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

      <div className="grid md:grid-cols-3 gap-8">
        {pageData.status.map((item, index) => {
          const Icon = iconMap[item.icon];
          return(
          <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                {Icon && <Icon className="w-8 h-8 text-primary" />}
              </div>
              <CardTitle className="font-headline text-2xl mt-4">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {item.availability ? (
                <>
                  <p className="text-xl font-semibold text-primary">{item.availability}</p>
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                </>
              ) : (
                <p>{item.description}</p>
              )}
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
}
