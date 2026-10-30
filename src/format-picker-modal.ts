import { App, Modal, Setting, Notice } from 'obsidian';
import { TimestampFormat } from './types';
import { parsePattern } from './tokens';

export class FormatPickerModal extends Modal {
  private formats: TimestampFormat[];
  private onSelectFormat: (format: TimestampFormat) => void;
  private searchQuery: string = '';
  private selectedIndex: number = 0;
  private showPreviews: boolean = true;
  private filteredFormats: TimestampFormat[] = [];

  constructor(
    app: App,
    formats: TimestampFormat[],
    onSelectFormat: (format: TimestampFormat) => void,
    showPreviews: boolean = true
  ) {
    super(app);
    this.formats = formats;
    this.onSelectFormat = onSelectFormat;
    this.showPreviews = showPreviews;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass('thymestamp-picker-modal');

    // Title
    contentEl.createEl('h2', { text: 'Select Timestamp Format' });

    // Search box
    const searchContainer = contentEl.createDiv('thymestamp-search-container');
    const searchInput = searchContainer.createEl('input', {
      type: 'text',
      placeholder: 'Search formats...',
      cls: 'thymestamp-search-input',
    });

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.selectedIndex = 0;
      this.updateResults();
    });

    // Results container
    const resultsContainer = contentEl.createDiv('thymestamp-results-container');

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredFormats.length - 1);
        this.updateResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.filteredFormats[this.selectedIndex]) {
          this.selectFormat(this.filteredFormats[this.selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Update function
    this.updateResults = () => {
      resultsContainer.empty();

      // Filter formats
      this.filteredFormats = this.formats.filter(format => {
        const query = this.searchQuery.toLowerCase();
        return (
          format.name.toLowerCase().includes(query) ||
          format.pattern.toLowerCase().includes(query) ||
          format.category?.toLowerCase().includes(query)
        );
      });

      // Sort: favorites first, then by usage count, then alphabetically
      this.filteredFormats.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        
        const usageA = a.usageCount || 0;
        const usageB = b.usageCount || 0;
        if (usageA !== usageB) return usageB - usageA;
        
        return a.name.localeCompare(b.name);
      });

      if (this.filteredFormats.length === 0) {
        resultsContainer.createDiv({
          text: 'No formats found',
          cls: 'thymestamp-no-results',
        });
        return;
      }

      // Group by category if categories exist
      const categorized = new Map<string, TimestampFormat[]>();
      const uncategorized: TimestampFormat[] = [];

      this.filteredFormats.forEach(format => {
        if (format.category) {
          if (!categorized.has(format.category)) {
            categorized.set(format.category, []);
          }
          const categoryFormats = categorized.get(format.category);
          if (categoryFormats) {
            categoryFormats.push(format);
          }
        } else {
          uncategorized.push(format);
        }
      });

      // Render uncategorized first
      if (uncategorized.length > 0) {
        uncategorized.forEach((format, index) => {
          this.renderFormatItem(resultsContainer, format, index);
        });
      }

      // Render categorized
      let currentIndex = uncategorized.length;
      categorized.forEach((formats, category) => {
        const categoryHeader = resultsContainer.createDiv('thymestamp-category-header');
        categoryHeader.createSpan({ text: category, cls: 'thymestamp-category-name' });
        
        formats.forEach(format => {
          this.renderFormatItem(resultsContainer, format, currentIndex++);
        });
      });
    };

    this.updateResults();
    searchInput.focus();
  }

  private renderFormatItem(container: HTMLElement, format: TimestampFormat, index: number) {
    const item = container.createDiv('thymestamp-format-item');
    
    if (index === this.selectedIndex) {
      item.addClass('is-selected');
      item.scrollIntoView({ block: 'nearest' });
    }

    // Favorite star
    if (format.isFavorite) {
      const star = item.createSpan({ cls: 'thymestamp-favorite-star' });
      star.innerHTML = '⭐';
    }

    // Format info
    const infoDiv = item.createDiv('thymestamp-format-info');
    
    const nameDiv = infoDiv.createDiv('thymestamp-format-name');
    nameDiv.createSpan({ text: format.name });
    
    if (format.usageCount && format.usageCount > 0) {
      nameDiv.createSpan({ 
        text: ` (${format.usageCount})`,
        cls: 'thymestamp-usage-count'
      });
    }

    infoDiv.createDiv({
      text: format.pattern,
      cls: 'thymestamp-format-pattern',
    });

    // Preview
    if (this.showPreviews) {
      const locale = navigator.language || 'en-US';
      const preview = parsePattern(format.pattern, new Date(), locale);
      infoDiv.createDiv({
        text: preview,
        cls: 'thymestamp-format-preview',
      });
    }

    // Click handler
    item.addEventListener('click', () => {
      this.selectFormat(format);
    });

    // Hover handler
    item.addEventListener('mouseenter', () => {
      this.selectedIndex = index;
      this.updateResults();
    });
  }

  private selectFormat(format: TimestampFormat) {
    this.onSelectFormat(format);
    this.close();
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  private updateResults: () => void = () => {};
}
