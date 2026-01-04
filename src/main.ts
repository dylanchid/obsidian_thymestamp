import { Plugin, MarkdownView, Notice, Editor, Menu } from 'obsidian';
import { ThymestampSettings, TimestampFormat, DEFAULT_SETTINGS } from './types';
import { parsePattern } from './tokens';
import { ThymestampSettingTab } from './settings';

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
    this.ribbonIconEl = this.addRibbonIcon('clock', 'Insert Timestamp', (evt) => {
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

    // Create a quick picker using a modal-like approach
    const menu = new Menu();

    this.settings.formats.forEach(format => {
      const locale = navigator.language || 'en-US';
      const preview = parsePattern(format.pattern, new Date(), locale);

      menu.addItem((item: any) => {
        item
          .setTitle(`${format.name}`)
          .setSection('formats')
          .onClick(() => {
            this.executeFormat(format, editor);
          });
      });
    });

    menu.addSeparator();
    menu.addItem((item: any) => {
      item
        .setTitle('Open Settings')
        .setIcon('settings')
        .onClick(() => {
          (this.app as any).setting.open();
          (this.app as any).setting.openTabById('thymestamp');
        });
    });

    // Position the menu near the ribbon icon or center of screen
    const rect = this.ribbonIconEl?.getBoundingClientRect();
    if (rect) {
      menu.showAtPosition({ x: rect.left, y: rect.top });
    } else {
      menu.showAtPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }
}
