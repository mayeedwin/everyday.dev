export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export interface PostsData {
  posts: Post[];
}

export interface TemplateData {
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readingTime: string;
  content: string;
  slug: string;
}
