export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  readingTime: number;
  published: boolean;
}

export interface BlogData {
  posts: BlogPost[];
}