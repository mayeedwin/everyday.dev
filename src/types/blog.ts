export interface BlogData {
  posts: BlogPost[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: string;
  slug: string;
  content?: string;
}
