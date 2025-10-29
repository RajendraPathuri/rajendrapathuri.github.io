import { getPostData, getAllPostIds } from "@/lib/posts";
import { format, parseISO } from 'date-fns';
import { notFound } from 'next/navigation';
import { Separator } from "@/components/ui/separator";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(p => ({slug: p.params.slug}));
}

export async function generateMetadata({ params }: PostPageProps) {
  try {
    const { slug } = await params;
    const postData = await getPostData(slug);
    return {
      title: `${postData.title} | Gitfolio Blogger`,
      description: postData.excerpt,
    };
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "This post could not be found."
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-3">
            {postData.title}
          </h1>
          <div className="text-muted-foreground">
            <span>By {postData.author} on </span>
            <time dateTime={postData.date}>
              {format(parseISO(postData.date), 'MMMM d, yyyy')}
            </time>
          </div>
        </header>

        <Separator className="my-8" />

        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
        />
      </article>
    );
  } catch (error) {
    notFound();
  }
}