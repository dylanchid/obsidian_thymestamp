import { Plugin, MarkdownView, Notice, Editor } from 'obsidian';
import { ThymestampSettings, TimestampFormat, DEFAULT_SETTINGS, FormatPreset } from './types';
import { parsePattern } from './tokens';
import { ThymestampSettingTab } from './settings';
import { FormatPickerModal } from './format-picker-modal';
import { PresetLibraryModal } from './preset-library-modal';

export default class ThymestampPlugin extends Plugin {
  settings: ThymestampSettings;
  private ribbonIconEl: HTMLElement | null = null;
  private registeredCommandIds: string[] = [];

  async onload() {
    await this.loadSettings();

    // Add settings tab
    this.addSettingTab(new ThymestampSettingTab(this.app, this));

    // Register commands for each format
    this.registerAllCommands();

    // Add ribbon icon for quick access
    this.ribbonIconEl = this.addRibbonIcon('clock', 'Insert Timestamp', () => {
      this.insertLastUsedFormat();
    });

    // Register command to open format picker
    this.addCommand({
      id: 'open-format-picker',
      name: 'Pick timestamp format',
      callback: () => {
        this.openFormatPicker();
      }
    });

    // Register command to browse preset library
    this.addCommand({
      id: 'browse-preset-library',
      name: 'Browse format presets',
      callback: () => {
        this.openPresetLibrary();
      }
    });
  }

  onunload() {
    // Cleanup is handled automatically by Obsidian
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  registerAllCommands() {
    this.settings.formats.forEach(format => {
      this.registerFormatCommand(format);
    });
  }

  registerFormatCommand(format: TimestampFormat) {
    const commandId = `insert-${format.id}`;
    this.registeredCommandIds.push(commandId);

    this.addCommand({
      id: commandId,
      name: `Insert: ${format.name}`,
      editorCallback: (editor: Editor) => {
        this.executeFormat(format, editor);
      }
    });
  }

  reloadCommands() {
    // Note: Obsidian doesn't support unregistering commands dynamically
    // Users need to reload the plugin for command changes to take full effect
    // But we can register new commands
    this.settings.formats.forEach(format => {
      if (!this.registeredCommandIds.includes(`insert-${format.id}`)) {
        this.registerFormatCommand(format);
      }
    });
  }

  private executeFormat(format: TimestampFormat, editor?: Editor) {
    const locale = navigator.language || 'en-US';
    const timestamp = parsePattern(format.pattern, new Date(), locale);

    // Increment usage count
    format.usageCount = (format.usageCount || 0) + 1;

    // Update last used format
    this.settings.lastUsedFormatId = format.id;
    this.saveSettings();

    if (format.outputMode === 'clipboard') {
      navigator.clipboard.writeText(timestamp).then(() => {
        new Notice(`Copied: ${timestamp}`);
      }).catch(() => {
        new Notice('Failed to copy to clipboard');
      });
    } else {
      // Insert at cursor
      if (editor) {
        editor.replaceSelection(timestamp);
      } else {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          view.editor.replaceSelection(timestamp);
        } else {
          // Fallback to clipboard if no editor
          navigator.clipboard.writeText(timestamp).then(() => {
            new Notice(`No editor active. Copied: ${timestamp}`);
          }).catch(() => {
            new Notice('Failed to copy to clipboard');
          });
        }
      }
    }
  }

  private insertLastUsedFormat() {
    const format = this.settings.formats.find(f => f.id === this.settings.lastUsedFormatId)
      || this.settings.formats[0];

    if (format) {
      this.executeFormat(format);
    } else {
      new Notice('No formats configured. Open settings to add formats.');
    }
  }

  private openFormatPicker() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;

    const modal = new FormatPickerModal(
      this.app,
      this.settings.formats,
      (format) => {
        this.executeFormat(format, editor);
      },
      this.settings.showPreviewsInPicker
    );

    modal.open();
  }

  private openPresetLibrary() {
    const modal = new PresetLibraryModal(this.app, (preset: FormatPreset) => {
      this.addFormatFromPreset(preset);
    });

    modal.open();
  }

  addFormatFromPreset(preset: FormatPreset) {
    const newFormat: TimestampFormat = {
      id: `format-${Date.now()}`,
      name: preset.name,
      pattern: preset.pattern,
      outputMode: 'insert',
      category: preset.category,
      usageCount: 0,
      isFavorite: false,
    };

    this.settings.formats.push(newFormat);
    this.saveSettings();
    this.registerFormatCommand(newFormat);
  }

  toggleFormatFavorite(formatId: string) {
    const format = this.settings.formats.find(f => f.id === formatId);
    if (format) {
      format.isFavorite = !format.isFavorite;
      this.saveSettings();
    }
  }

  duplicateFormat(formatId: string) {
    const format = this.settings.formats.find(f => f.id === formatId);
    if (format) {
      const duplicate: TimestampFormat = {
        ...format,
        id: `format-${Date.now()}`,
        name: `${format.name} (Copy)`,
        usageCount: 0,
      };
      this.settings.formats.push(duplicate);
      this.saveSettings();
      this.registerFormatCommand(duplicate);
    }
  }

  exportFormats(): string {
    return JSON.stringify(this.settings.formats, null, 2);
  }

  importFormats(jsonData: string): boolean {
    try {
      const formats = JSON.parse(jsonData) as TimestampFormat[];

      if (!Array.isArray(formats)) {
        throw new Error('Invalid format: expected an array');
      }

      formats.forEach(format => {
        if (!format.id || !format.name || !format.pattern) {
          throw new Error('Invalid format structure');
        }

        // Ensure format has required fields
        format.id = `format-${Date.now()}-${Math.random()}`;
        format.usageCount = 0;

        this.settings.formats.push(format);
        this.registerFormatCommand(format);
      });

      this.saveSettings();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      new Notice(`Import failed: ${errorMessage}`);
      return false;
    }
  }
}
