export type OutputMode = 'insert' | 'clipboard';

export interface TimestampFormat {
  id: string;
  name: string;
  pattern: string;
  outputMode: OutputMode;
  category?: string;
  isFavorite?: boolean;
  usageCount?: number;
  order?: number;
}

export interface FormatCategory {
  id: string;
  name: string;
  collapsed?: boolean;
}

export interface FormatPreset {
  name: string;
  description: string;
  pattern: string;
  category: string;
}

export interface ThymestampSettings {
  formats: TimestampFormat[];
  lastUsedFormatId: string | null;
  categories: FormatCategory[];
  showPreviewsInPicker: boolean;
}

export const DEFAULT_FORMATS: TimestampFormat[] = [
  {
    id: 'journal-header',
    name: 'Journal Header',
    pattern: '{day}, {month} {date} {hours}:{minutes} {period}',
    outputMode: 'insert',
  },
  {
    id: 'date-simple',
    name: 'Simple Date',
    pattern: '{month} {date}, {year}',
    outputMode: 'insert',
  },
  {
    id: 'date-iso',
    name: 'ISO Date',
    pattern: '{year}-{month-pad}-{date-pad}',
    outputMode: 'insert',
  },
  {
    id: 'time-12h',
    name: 'Time (12h)',
    pattern: '{hours}:{minutes} {period}',
    outputMode: 'insert',
  },
  {
    id: 'time-24h',
    name: 'Time (24h)',
    pattern: '{hours24-pad}:{minutes}',
    outputMode: 'insert',
  },
  {
    id: 'full-datetime',
    name: 'Full DateTime',
    pattern: '{day}, {month} {date-ord}, {year} at {hours}:{minutes} {period}',
    outputMode: 'insert',
  },
];

export const DEFAULT_CATEGORIES: FormatCategory[] = [
  { id: 'general', name: 'General', collapsed: false },
  { id: 'journal', name: 'Journal', collapsed: false },
  { id: 'development', name: 'Development', collapsed: false },
  { id: 'personal', name: 'Personal', collapsed: false },
];

export const FORMAT_PRESETS: FormatPreset[] = [
  // General
  {
    name: 'ISO 8601',
    description: 'Full ISO 8601 timestamp',
    pattern: '{iso}',
    category: 'general',
  },
  {
    name: 'Unix Timestamp',
    description: 'Unix epoch timestamp',
    pattern: '{unix}',
    category: 'general',
  },
  {
    name: 'US Date',
    description: 'MM/DD/YYYY format',
    pattern: '{month-pad}/{date-pad}/{year}',
    category: 'general',
  },
  {
    name: 'EU Date',
    description: 'DD/MM/YYYY format',
    pattern: '{date-pad}/{month-pad}/{year}',
    category: 'general',
  },
  {
    name: 'Simple Time',
    description: '24-hour time',
    pattern: '{hours24-pad}:{minutes}:{seconds}',
    category: 'general',
  },
  // Journal
  {
    name: 'Journal Entry',
    description: 'Full date with time',
    pattern: '{day}, {month} {date-ord}, {year} at {time}',
    category: 'journal',
  },
  {
    name: 'Daily Note Title',
    description: 'YYYY-MM-DD format',
    pattern: '{year}-{month-pad}-{date-pad}',
    category: 'journal',
  },
  {
    name: 'Weekly Note',
    description: 'Year and week number',
    pattern: '{year}-{iso-week}',
    category: 'journal',
  },
  {
    name: 'Time Log',
    description: 'Bracketed time for logs',
    pattern: '[{hours24-pad}:{minutes}:{seconds}]',
    category: 'journal',
  },
  // Development
  {
    name: 'Zettelkasten ID',
    description: 'YYYYMMDDHHmmss format',
    pattern: '{year}{month-pad}{date-pad}{hours24-pad}{minutes}{seconds}',
    category: 'development',
  },
  {
    name: 'Git Commit Style',
    description: 'Date for commit messages',
    pattern: '{year}-{month-pad}-{date-pad} {hours24-pad}:{minutes}',
    category: 'development',
  },
  {
    name: 'Version Tag',
    description: 'v{year}.{month}.{date} format',
    pattern: 'v{year}.{month-num}.{date}',
    category: 'development',
  },
  {
    name: 'Filename Safe',
    description: 'Safe for filenames',
    pattern: '{year}{month-pad}{date-pad}_{hours24-pad}{minutes}{seconds}',
    category: 'development',
  },
  // Personal
  {
    name: 'Friendly Date',
    description: 'Month Date, Year',
    pattern: '{month} {date}, {year}',
    category: 'personal',
  },
  {
    name: 'Relative Time',
    description: 'Today/yesterday with time',
    pattern: '{relative} at {time}',
    category: 'personal',
  },
  {
    name: 'Casual DateTime',
    description: 'Day, time with period',
    pattern: '{day-abb} {hours}:{minutes} {period-lower}',
    category: 'personal',
  },
  {
    name: 'Full Context',
    description: 'Everything you need',
    pattern: '{day}, {month} {date-ord}, {year} - {time} ({timezone})',
    category: 'personal',
  },
];

export const DEFAULT_SETTINGS: ThymestampSettings = {
  formats: DEFAULT_FORMATS,
  lastUsedFormatId: 'journal-header',
  categories: DEFAULT_CATEGORIES,
  showPreviewsInPicker: true,
};

export interface TokenDefinition {
  token: string;
  description: string;
  category: string;
  getValue: (date: Date, locale: string) => string;
}
