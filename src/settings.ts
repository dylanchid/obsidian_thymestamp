import { App, PluginSettingTab, Setting, TextComponent, DropdownComponent, Notice } from 'obsidian';
import type ThymestampPlugin from './main';
import { TimestampFormat, OutputMode, DEFAULT_FORMATS } from './types';
import { parsePattern, getTokensByCategory } from './tokens';

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

    // Formats section
    containerEl.createEl('h2', { text: 'Timestamp Formats' });
    containerEl.createEl('p', {
      text: 'Create custom formats using tokens. Each format becomes a command you can assign a hotkey to.',
      cls: 'setting-item-description'
    });

    // Add new format button
    new Setting(containerEl)
      .setName('Add New Format')
      .setDesc('Create a new timestamp format')
      .addButton(button => button
        .setButtonText('+ Add Format')
        .setCta()
        .onClick(async () => {
          const newFormat: TimestampFormat = {
            id: `format-${Date.now()}`,
            name: 'New Format',
            pattern: '{day}, {month} {date}',
            outputMode: 'insert',
          };
          this.plugin.settings.formats.push(newFormat);
          await this.plugin.saveSettings();
          this.plugin.registerFormatCommand(newFormat);
          this.display();
        }));

    // Reset to defaults button
    new Setting(containerEl)
      .setName('Reset to Defaults')
      .setDesc('Restore the default format presets')
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

    // Format header with delete button
    const headerDiv = formatDiv.createDiv('thymestamp-format-header');
    headerDiv.createEl('h3', { text: `Format ${index + 1}` });

    // Delete button
    const deleteBtn = headerDiv.createEl('button', {
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

    // Format pattern with live preview
    let patternInput: TextComponent;
    const patternSetting = new Setting(formatDiv)
      .setName('Pattern')
      .setDesc('Token pattern for this format')
      .addText(text => {
        patternInput = text;
        text
          .setPlaceholder('{day}, {month} {date}')
          .setValue(format.pattern)
          .onChange(async (value) => {
            format.pattern = value;
            await this.plugin.saveSettings();
            this.updatePreview(previewEl, value);
          });
        text.inputEl.addClass('thymestamp-pattern-input');
      });

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
