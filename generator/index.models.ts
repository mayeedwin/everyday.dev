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
  title?: string;
  excerpt?: string;
  date?: string;
  dateISO?: string;
  readingTime?: string;
  content?: string;
  slug?: string;
  posts?: string;
  currentYear?: number;
}

export interface BlogTemplateData extends TemplateData {
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readingTime: string;
  content: string;
  slug: string;
  currentYear: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  iconPath: string;
}

export interface SiteConfig {
  site: {
    name: string;
    textLogo?: string;
    title: string;
    description: string;
    url: string;
    logo: string;
    favicon: string;
    banner: string;
  };
  author: {
    name: string;
    title: string;
    jobTitle: string;
    bio: string;
    avatar: string;
    contact?: {
      email: string;
      twitter: string;
    };
    social: {
      github: string;
      twitter: string;
      linkedin: string;
      youtube: string;
    };
    socialLinks: SocialLink[];
  };
  navigation: NavigationItem[];
  build: {
    wordsPerMinute: number;
    outputDir: string;
    templateDir: string;
  };
  seo: {
    keywords: string[];
  };
}
