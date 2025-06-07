export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  location: string;
  description: string;
  type: string;
  duration: string;
  audience: string;
  topics: string[];
  links: Record<string, string>;
}

export interface SpeakingData {
  speaking: Talk[];
}

export type LinkType = 'slides' | 'video' | 'repository' | 'event';