export * from './speaking';
export * from './blog';

export interface RouteData {
  title: string;
  content: string;
  url: string;
}

export interface UIElements {
  toggle: HTMLElement | null;
  sidebar: HTMLElement | null;
  overlay: HTMLElement | null;
}