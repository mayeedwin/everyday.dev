export interface Talk {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  duration: string;
  audience: string;
  topics: string[];
  links: Record<string, string>;
}

export interface SpeakingData {
  speaking: Talk[];
}
