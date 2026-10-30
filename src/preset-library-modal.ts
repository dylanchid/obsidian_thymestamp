import { App, Modal, Setting, Notice } from 'obsidian';
import { FormatPreset, FORMAT_PRESETS, TimestampFormat } from './types';
import { parsePattern } from './tokens';

export class PresetLibraryModal extends Modal {
  private onSelectPreset: (preset: FormatPreset) => void;
  private selectedCategory: string | null = null;

  constructor(app: App, onSelectPreset: (preset: FormatPreset) => void) {
    super(app);
    this.onSelectPreset = onSelectPreset;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass('thymestamp-preset-modal');

    contentEl.createEl('h2', { text: 'Format Preset Library' });
    contentEl.createEl('p', {
      text: 'Choose from popular timestamp formats. Click any preset to add it to your formats.',
      cls: 'thymestamp-preset-description'
    });

    // Category filter
    const filterContainer = contentEl.createDiv('thymestamp-preset-filters');
    
    const categories = ['all', ...new Set(FORMAT_PRESETS.map(p => p.category))];
    
    categories.forEach(category => {
      const btn = filterContainer.createEl('button', {
        text: category.charAt(0).toUpperCase() + category.slice(1),
        cls: 'thymestamp-category-filter',
      });

      if (category === 'all') {
        btn.addClass('is-active');
      }

      btn.addEventListener('click', () => {
        this.selectedCategory = category === 'all' ? null : category;
        filterContainer.querySelectorAll('.thymestamp-category-filter').forEach(b => {
          b.removeClass('is-active');
        });
        btn.addClass('is-active');
        this.renderPresets(presetsContainer);
      });
    });

    // Presets container
    const presetsContainer = contentEl.createDiv('thymestamp-presets-container');
    this.renderPresets(presetsContainer);
  }

  private renderPresets(container: HTMLElement) {
    container.empty();

    const filteredPresets = this.selectedCategory
      ? FORMAT_PRESETS.filter(p => p.category === this.selectedCategory)
      : FORMAT_PRESETS;

    // Group by category
    const grouped = new Map<string, FormatPreset[]>();
    filteredPresets.forEach(preset => {
      if (!grouped.has(preset.category)) {
        grouped.set(preset.category, []);
      }
      const categoryPresets = grouped.get(preset.category);
      if (categoryPresets) {
        categoryPresets.push(preset);
      }
    });

    grouped.forEach((presets, category) => {
      if (!this.selectedCategory) {
        const categoryHeader = container.createDiv('thymestamp-preset-category-header');
        categoryHeader.createEl('h3', { text: category.charAt(0).toUpperCase() + category.slice(1) });
      }

      const grid = container.createDiv('thymestamp-preset-grid');

      presets.forEach(preset => {
        this.renderPresetCard(grid, preset);
      });
    });
  }

  private renderPresetCard(container: HTMLElement, preset: FormatPreset) {
    const card = container.createDiv('thymestamp-preset-card');

    card.createEl('h4', { text: preset.name });
    card.createEl('p', { 
      text: preset.description,
      cls: 'thymestamp-preset-card-description'
    });

    const patternEl = card.createDiv('thymestamp-preset-pattern');
    patternEl.createEl('code', { text: preset.pattern });

    // Preview
    const locale = navigator.language || 'en-US';
    const preview = parsePattern(preset.pattern, new Date(), locale);
    const previewEl = card.createDiv('thymestamp-preset-preview');
    previewEl.createSpan({ text: 'Preview: ', cls: 'preview-label' });
    previewEl.createSpan({ text: preview, cls: 'preview-value' });

    // Add button
    const addBtn = card.createEl('button', {
      text: 'Add Format',
      cls: 'mod-cta',
    });

    addBtn.addEventListener('click', () => {
      this.onSelectPreset(preset);
      new Notice(`Added "${preset.name}" format`);
    });

    // Copy pattern button
    const copyBtn = card.createEl('button', {
      text: 'Copy Pattern',
      cls: 'thymestamp-copy-pattern-btn',
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(preset.pattern).then(() => {
        new Notice(`Copied pattern: ${preset.pattern}`);
      }).catch(() => {
        new Notice('Failed to copy pattern');
      });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
