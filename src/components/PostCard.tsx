import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PostData } from "@/lib/posts";
import { ArrowRight } from "lucide-react";

type PostCardProps = {
  post: PostData;
};

export default function PostCard({ post }: PostCardProps) {
  const { id, date, title, excerpt, author } = post;
  const formattedDate = format(parseISO(date), "MMMM d, yyyy");

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          <Link href={`/blog/${id}`} className="hover:text-primary transition-colors">{title}</Link>
        </CardTitle>
        <CardDescription>
          <time dateTime={date}>{formattedDate}</time> by {author}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary p-0 h-auto">
          <Link href={`/blog/${id}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
