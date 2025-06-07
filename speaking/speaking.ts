import { DateFormatter, DOMUtils, ErrorHandler } from '../src/utils/ui.js';
import type { Talk, SpeakingData, LinkType } from '../src/types/speaking.js';

/**
 * Icon definitions for different link types
 */
const LINK_ICONS: Record<string, string> = {
  slides: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="9" y1="9" x2="15" y2="9"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="15" x2="13" y2="15"/>
  </svg>`,
  video: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="5,3 19,12 5,21"/>
  </svg>`,
  repository: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>`,
  event: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`
};

/**
 * Template builder for talk cards
 */
class TalkCardBuilder {
  static build(talk: Talk): string {
    const formattedDate = DateFormatter.format(talk.date);
    const topicsHtml = this.buildTopicsHtml(talk.topics);
    const linksHtml = this.buildLinksHtml(talk.links);

    return `
      <article class="talk-card">
        <div class="talk-header">
          <div class="talk-meta">
            <time class="talk-date">${formattedDate}</time>
            <span class="talk-type">${talk.type}</span>
            <div class="talk-location">${talk.location}</div>
          </div>
          ${linksHtml}
        </div>
        
        <div class="talk-content">
          <h3 class="talk-title">${talk.title}</h3>
          <p class="talk-event">${talk.event}</p>
          <p class="talk-description">${talk.description}</p>
          
          <div class="talk-footer">
            <div class="talk-topics">${topicsHtml}</div>
          </div>
        </div>
      </article>
    `;
  }

  private static buildTopicsHtml(topics: string[]): string {
    return topics
      .slice(0, 3)
      .map(topic => `<span class="topic-tag">${topic}</span>`)
      .join('');
  }

  private static buildLinksHtml(links: Record<string, string>): string {
    if (!links || Object.keys(links).length === 0) return '';

    const linkButtons = Object.entries(links)
      .map(([type, url]) => this.buildLinkButton(type, url))
      .join('');

    return `<div class="talk-links">${linkButtons}</div>`;
  }

  private static buildLinkButton(type: string, url: string): string {
    const linkText = type.charAt(0).toUpperCase() + type.slice(1);
    const iconSvg = LINK_ICONS[type] || LINK_ICONS.event;
    
    return `
      <a href="${url}" class="talk-link" target="_blank" rel="noopener noreferrer">
        ${iconSvg}
        ${linkText}
      </a>
    `;
  }
}

/**
 * Data service for speaking engagements
 */
class SpeakingDataService {
  private static readonly DATA_URL = '../src/data/speaking.json';

  static async fetchSpeakingData(): Promise<Talk[]> {
    const response = await fetch(this.DATA_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch speaking data: ${response.status}`);
    }

    const data: SpeakingData = await response.json();
    return data.speaking || [];
  }
}

/**
 * Main speaking page manager
 */
class SpeakingManager {
  private static readonly CONTAINER_ID = 'speaking-list';
  private static readonly NO_RESULTS_MESSAGE = 'No speaking engagements found.';
  private static readonly ERROR_MESSAGE = 'Sorry, there was an error loading the speaking engagements.';

  private speakingData: Talk[] = [];

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const container = document.getElementById(SpeakingManager.CONTAINER_ID);
    if (!container) {
      console.error(`Container with ID "${SpeakingManager.CONTAINER_ID}" not found`);
      return;
    }

    await ErrorHandler.withErrorHandling(
      async () => {
        this.speakingData = await SpeakingDataService.fetchSpeakingData();
        this.renderSpeakingList(container);
      },
      () => this.showError(container)
    );
  }

  private renderSpeakingList(container: HTMLElement): void {
    const sortedData = DateFormatter.sortByDate(this.speakingData, 'date');

    if (sortedData.length === 0) {
      this.showNoResults(container);
      return;
    }

    const cardsHtml = sortedData
      .map(talk => TalkCardBuilder.build(talk))
      .join('');

    container.innerHTML = cardsHtml;
  }

  private showNoResults(container: HTMLElement): void {
    container.innerHTML = `
      <div class="no-results">
        <p>${SpeakingManager.NO_RESULTS_MESSAGE}</p>
      </div>
    `;
  }

  private showError(container: HTMLElement): void {
    ErrorHandler.showError(
      container,
      SpeakingManager.ERROR_MESSAGE,
      () => window.location.reload()
    );
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SpeakingManager();
  });
} else {
  new SpeakingManager();
}