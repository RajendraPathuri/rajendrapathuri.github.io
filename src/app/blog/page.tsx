import { getSortedPostsData } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          My Blog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Thoughts, tutorials, and stories from my journey in tech.
        </p>
      </div>
      
      {allPosts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
