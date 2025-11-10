import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostData = {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  contentHtml?: string;
};

export function getSortedPostsData(): PostData[] {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory does not exist, returning empty array');
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  // Filter only .md files
  const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
  
  if (mdFiles.length === 0) {
    console.warn('No markdown files found in posts directory');
    return [];
  }

  const allPostsData = mdFiles
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        // Validate required fields and provide defaults
        const postData: PostData = {
          id,
          title: matterResult.data.title || 'Untitled Post',
          date: matterResult.data.date || new Date().toISOString().split('T')[0],
          author: matterResult.data.author || 'Anonymous',
          excerpt: matterResult.data.excerpt || 'No excerpt available',
        };

        return postData;
      } catch (error) {
        console.error(`Error reading post ${fileName}:`, error);
        return null;
      }
    })
    .filter((post): post is PostData => post !== null);

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory does not exist, returning empty array');
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  // Filter only .md files
  const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
  
  return mdFiles.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Validate and provide defaults for required fields
  return {
    id,
    contentHtml,
    title: matterResult.data.title || 'Untitled Post',
    date: matterResult.data.date || new Date().toISOString().split('T')[0],
    author: matterResult.data.author || 'Anonymous',
    excerpt: matterResult.data.excerpt || 'No excerpt available',
  } as PostData;
}