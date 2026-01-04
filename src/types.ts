export type OutputMode = 'insert' | 'clipboard';

export interface TimestampFormat {
  id: string;
  name: string;
  pattern: string;
  outputMode: OutputMode;
}

export interface ThymestampSettings {
  formats: TimestampFormat[];
  lastUsedFormatId: string | null;
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

export const DEFAULT_SETTINGS: ThymestampSettings = {
  formats: DEFAULT_FORMATS,
  lastUsedFormatId: 'journal-header',
};

export interface TokenDefinition {
  token: string;
  description: string;
  category: string;
  getValue: (date: Date, locale: string) => string;
}
