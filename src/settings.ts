import { App, PluginSettingTab, Setting, Notice, TextAreaComponent } from 'obsidian';
import type ThymestampPlugin from './main';
import { TimestampFormat, OutputMode, DEFAULT_FORMATS } from './types';
import { parsePattern, getTokensByCategory } from './tokens';
import { PresetLibraryModal } from './preset-library-modal';
import { NaturalFormatParser } from './natural-parser';

export class ThymestampSettingTab extends PluginSettingTab {
  plugin: ThymestampPlugin;

  constructor(app: App, plugin: ThymestampPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h1', { text: 'Thymestamp Settings' });

    // General settings
    containerEl.createEl('h2', { text: 'General' });

    new Setting(containerEl)
      .setName('Show previews in picker')
      .setDesc('Display timestamp previews in the format picker modal')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showPreviewsInPicker)
        .onChange(async (value) => {
          this.plugin.settings.showPreviewsInPicker = value;
          await this.plugin.saveSettings();
        }));

    // Import/Export section
    containerEl.createEl('h2', { text: 'Import/Export' });

    new Setting(containerEl)
      .setName('Export formats')
      .setDesc('Export all your formats as JSON')
      .addButton(button => button
        .setButtonText('Export')
        .onClick(() => {
          const json = this.plugin.exportFormats();
          navigator.clipboard.writeText(json);
          new Notice('Formats copied to clipboard!');
        }));

    new Setting(containerEl)
      .setName('Import formats')
      .setDesc('Import formats from JSON (paste in textarea below and click Import)')
      .addTextArea(text => {
        text.setPlaceholder('Paste JSON here...');
        text.inputEl.rows = 6;
        text.inputEl.addClass('thymestamp-import-textarea');
        return text;
      })
      .addButton(button => button
        .setButtonText('Import')
        .setCta()
        .onClick(async () => {
          const textarea = containerEl.querySelector('.thymestamp-import-textarea') as HTMLTextAreaElement;
          if (textarea && textarea.value) {
            const success = this.plugin.importFormats(textarea.value);
            if (success) {
              new Notice('Formats imported successfully!');
              textarea.value = '';
              this.display();
            }
          } else {
            new Notice('Please paste JSON data first');
          }
        }));

    // Formats section
    containerEl.createEl('h2', { text: 'Timestamp Formats' });
    containerEl.createEl('p', {
      text: 'Create custom formats using tokens. Each format becomes a command you can assign a hotkey to.',
      cls: 'setting-item-description'
    });

    // Action buttons row
    const actionsContainer = containerEl.createDiv('thymestamp-actions-row');

    new Setting(actionsContainer)
      .addButton(button => button
        .setButtonText('+ Add Format')
        .setCta()
        .onClick(async () => {
          const newFormat: TimestampFormat = {
            id: `format-${Date.now()}`,
            name: 'New Format',
            pattern: '{day}, {month} {date}',
            outputMode: 'insert',
            usageCount: 0,
            isFavorite: false,
          };
          this.plugin.settings.formats.push(newFormat);
          await this.plugin.saveSettings();
          this.plugin.registerFormatCommand(newFormat);
          this.display();
        }))
      .addButton(button => button
        .setButtonText('📚 Browse Presets')
        .onClick(() => {
          new PresetLibraryModal(this.app, (preset) => {
            this.plugin.addFormatFromPreset(preset);
            this.display();
          }).open();
        }))
      .addButton(button => button
        .setButtonText('Reset')
        .setWarning()
        .onClick(async () => {
          this.plugin.settings.formats = [...DEFAULT_FORMATS];
          await this.plugin.saveSettings();
          this.plugin.reloadCommands();
          this.display();
          new Notice('Formats reset to defaults');
        }));

    // Display each format
    const formatsContainer = containerEl.createDiv('thymestamp-formats-container');

    this.plugin.settings.formats.forEach((format, index) => {
      this.renderFormatSettings(formatsContainer, format, index);
    });

    // Token Reference section
    containerEl.createEl('h2', { text: 'Token Reference' });
    containerEl.createEl('p', {
      text: 'Use these tokens in your format patterns. Tokens are replaced with the current date/time values.',
      cls: 'setting-item-description'
    });

    this.renderTokenReference(containerEl);
  }

  private renderFormatSettings(container: HTMLElement, format: TimestampFormat, index: number): void {
    const formatDiv = container.createDiv('thymestamp-format-item');

    // Format header with actions
    const headerDiv = formatDiv.createDiv('thymestamp-format-header');
    
    const headerLeft = headerDiv.createDiv('thymestamp-format-header-left');
    headerLeft.createEl('h3', { text: `Format ${index + 1}` });
    
    // Favorite star
    const favoriteBtn = headerLeft.createEl('button', {
      text: format.isFavorite ? '⭐' : '☆',
      cls: 'thymestamp-favorite-btn',
      attr: { 'aria-label': 'Toggle favorite' }
    });
    favoriteBtn.addEventListener('click', async () => {
      this.plugin.toggleFormatFavorite(format.id);
      this.display();
    });

    // Usage count badge
    if (format.usageCount && format.usageCount > 0) {
      headerLeft.createSpan({
        text: `${format.usageCount} uses`,
        cls: 'thymestamp-usage-badge'
      });
    }

    const headerRight = headerDiv.createDiv('thymestamp-format-header-right');
    
    // Duplicate button
    const duplicateBtn = headerRight.createEl('button', {
      text: 'Duplicate',
      cls: 'thymestamp-action-btn'
    });
    duplicateBtn.addEventListener('click', async () => {
      this.plugin.duplicateFormat(format.id);
      this.display();
      new Notice(`Duplicated "${format.name}"`);
    });

    // Delete button
    const deleteBtn = headerRight.createEl('button', {
      text: 'Delete',
      cls: 'mod-warning'
    });
    deleteBtn.addEventListener('click', async () => {
      this.plugin.settings.formats.splice(index, 1);
      await this.plugin.saveSettings();
      this.plugin.reloadCommands();
      this.display();
    });

    // Format name
    new Setting(formatDiv)
      .setName('Name')
      .setDesc('Display name for this format (used in command palette)')
      .addText(text => text
        .setPlaceholder('My Format')
        .setValue(format.name)
        .onChange(async (value) => {
          format.name = value;
          await this.plugin.saveSettings();
          this.plugin.reloadCommands();
        }));

    // Category selection
    new Setting(formatDiv)
      .setName('Category')
      .setDesc('Organize formats by category')
      .addDropdown(dropdown => {
        dropdown.addOption('', 'None');
        this.plugin.settings.categories.forEach(cat => {
          dropdown.addOption(cat.id, cat.name);
        });
        dropdown.setValue(format.category || '');
        dropdown.onChange(async (value) => {
          format.category = value || undefined;
          await this.plugin.saveSettings();
        });
      });

    // Format pattern with live preview
    const patternSetting = new Setting(formatDiv)
      .setName('Pattern')
      .setDesc('Token pattern for this format. Validation will show below.')
      .addText(text => {
        text
          .setPlaceholder('{day}, {month} {date}')
          .setValue(format.pattern)
          .onChange(async (value) => {
            format.pattern = value;
            await this.plugin.saveSettings();
            this.updatePreview(previewEl, value);
            this.updateValidation(validationEl, value);
          });
        text.inputEl.addClass('thymestamp-pattern-input');
      });

    // Pattern validation
    const validationEl = formatDiv.createDiv('thymestamp-validation');
    this.updateValidation(validationEl, format.pattern);

    // Live preview
    const previewEl = formatDiv.createDiv('thymestamp-preview');
    this.updatePreview(previewEl, format.pattern);

    // Output mode
    new Setting(formatDiv)
      .setName('Output Mode')
      .setDesc('How the timestamp is outputted')
      .addDropdown(dropdown => dropdown
        .addOption('insert', 'Insert at cursor')
        .addOption('clipboard', 'Copy to clipboard')
        .setValue(format.outputMode)
        .onChange(async (value: OutputMode) => {
          format.outputMode = value;
          await this.plugin.saveSettings();
        }));
  }

  private updatePreview(previewEl: HTMLElement, pattern: string): void {
    const locale = navigator.language || 'en-US';
    const preview = parsePattern(pattern, new Date(), locale);
    previewEl.empty();
    previewEl.createSpan({ text: 'Preview: ', cls: 'thymestamp-preview-label' });
    previewEl.createSpan({ text: preview, cls: 'thymestamp-preview-value' });
  }

  private updateValidation(validationEl: HTMLElement, pattern: string): void {
    const result = NaturalFormatParser.validatePattern(pattern);
    validationEl.empty();

    if (result.valid) {
      validationEl.createSpan({
        text: '✓ Valid pattern',
        cls: 'thymestamp-validation-success'
      });
    } else {
      validationEl.createSpan({
        text: '✗ Invalid tokens: ' + result.errors.join(', '),
        cls: 'thymestamp-validation-error'
      });
    }
  }

  private renderTokenReference(container: HTMLElement): void {
    const tokensByCategory = getTokensByCategory();
    const referenceDiv = container.createDiv('thymestamp-token-reference');

    tokensByCategory.forEach((tokens, category) => {
      const categoryDiv = referenceDiv.createDiv('thymestamp-token-category');
      categoryDiv.createEl('h4', { text: category });

      const table = categoryDiv.createEl('table', { cls: 'thymestamp-token-table' });
      const thead = table.createEl('thead');
      const headerRow = thead.createEl('tr');
      headerRow.createEl('th', { text: 'Token' });
      headerRow.createEl('th', { text: 'Description' });
      headerRow.createEl('th', { text: 'Example' });

      const tbody = table.createEl('tbody');
      const locale = navigator.language || 'en-US';
      const now = new Date();

      tokens.forEach(token => {
        const row = tbody.createEl('tr');
        const tokenCell = row.createEl('td');
        const tokenCode = tokenCell.createEl('code', { text: `{${token.token}}` });
        tokenCode.addEventListener('click', () => {
          navigator.clipboard.writeText(`{${token.token}}`);
          new Notice(`Copied {${token.token}} to clipboard`);
        });
        tokenCode.addClass('thymestamp-token-code');
        row.createEl('td', { text: token.description });
        row.createEl('td', {
          text: token.getValue(now, locale),
          cls: 'thymestamp-token-example'
        });
      });
    });
  }
}
