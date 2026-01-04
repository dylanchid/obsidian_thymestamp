import { TokenDefinition } from './types';

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

function getSeason(date: Date): string {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getRelativeDay(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays === -1) return 'yesterday';
  if (diffDays > 1 && diffDays <= 7) return `in ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return target.toLocaleDateString();
}

function getTimezoneAbbr(date: Date): string {
  const tzString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' });
  const match = tzString.match(/[A-Z]{2,5}$/);
  return match ? match[0] : '';
}

function getTimezoneFull(date: Date): string {
  const tzString = date.toLocaleTimeString('en-US', { timeZoneName: 'long' });
  const parts = tzString.split(' ');
  return parts.slice(2).join(' ');
}

function getUTCOffset(date: Date): string {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}

export const TOKEN_DEFINITIONS: TokenDefinition[] = [
  // Days
  {
    token: 'day',
    description: 'Full day name (Wednesday)',
    category: 'Days',
    getValue: (date, locale) => date.toLocaleDateString(locale, { weekday: 'long' }),
  },
  {
    token: 'day-abb',
    description: 'Abbreviated day (Wed)',
    category: 'Days',
    getValue: (date, locale) => date.toLocaleDateString(locale, { weekday: 'short' }),
  },
  {
    token: 'day-num',
    description: 'Day of week 1-7 (3)',
    category: 'Days',
    getValue: (date) => String(date.getDay() === 0 ? 7 : date.getDay()),
  },

  // Month
  {
    token: 'month',
    description: 'Full month name (July)',
    category: 'Month',
    getValue: (date, locale) => date.toLocaleDateString(locale, { month: 'long' }),
  },
  {
    token: 'month-abb',
    description: 'Abbreviated month (Jul)',
    category: 'Month',
    getValue: (date, locale) => date.toLocaleDateString(locale, { month: 'short' }),
  },
  {
    token: 'month-num',
    description: 'Month number (7)',
    category: 'Month',
    getValue: (date) => String(date.getMonth() + 1),
  },
  {
    token: 'month-pad',
    description: 'Month zero-padded (07)',
    category: 'Month',
    getValue: (date) => String(date.getMonth() + 1).padStart(2, '0'),
  },

  // Date (day of month)
  {
    token: 'date',
    description: 'Day of month (30)',
    category: 'Date',
    getValue: (date) => String(date.getDate()),
  },
  {
    token: 'date-pad',
    description: 'Day zero-padded (03)',
    category: 'Date',
    getValue: (date) => String(date.getDate()).padStart(2, '0'),
  },
  {
    token: 'date-ord',
    description: 'Day with ordinal (30th)',
    category: 'Date',
    getValue: (date) => getOrdinalSuffix(date.getDate()),
  },

  // Year
  {
    token: 'year',
    description: 'Full year (2026)',
    category: 'Year',
    getValue: (date) => String(date.getFullYear()),
  },
  {
    token: 'year-short',
    description: 'Two-digit year (26)',
    category: 'Year',
    getValue: (date) => String(date.getFullYear()).slice(-2),
  },

  // Time 12-hour
  {
    token: 'time',
    description: 'Full 12h time (1:36 AM)',
    category: 'Time 12h',
    getValue: (date, locale) => date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
  },
  {
    token: 'hours',
    description: 'Hour 1-12 (1)',
    category: 'Time 12h',
    getValue: (date) => {
      const h = date.getHours() % 12;
      return String(h === 0 ? 12 : h);
    },
  },
  {
    token: 'hours-pad',
    description: 'Hour zero-padded (01)',
    category: 'Time 12h',
    getValue: (date) => {
      const h = date.getHours() % 12;
      return String(h === 0 ? 12 : h).padStart(2, '0');
    },
  },
  {
    token: 'minutes',
    description: 'Minutes (36)',
    category: 'Time 12h',
    getValue: (date) => String(date.getMinutes()).padStart(2, '0'),
  },
  {
    token: 'seconds',
    description: 'Seconds (45)',
    category: 'Time 12h',
    getValue: (date) => String(date.getSeconds()).padStart(2, '0'),
  },
  {
    token: 'period',
    description: 'AM/PM',
    category: 'Time 12h',
    getValue: (date) => date.getHours() < 12 ? 'AM' : 'PM',
  },
  {
    token: 'period-lower',
    description: 'am/pm',
    category: 'Time 12h',
    getValue: (date) => date.getHours() < 12 ? 'am' : 'pm',
  },

  // Time 24-hour
  {
    token: 'time24',
    description: 'Full 24h time (13:36)',
    category: 'Time 24h',
    getValue: (date, locale) => date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
  },
  {
    token: 'hours24',
    description: 'Hour 0-23 (13)',
    category: 'Time 24h',
    getValue: (date) => String(date.getHours()),
  },
  {
    token: 'hours24-pad',
    description: 'Hour zero-padded (01)',
    category: 'Time 24h',
    getValue: (date) => String(date.getHours()).padStart(2, '0'),
  },
  {
    token: 'milliseconds',
    description: 'Milliseconds (123)',
    category: 'Time 24h',
    getValue: (date) => String(date.getMilliseconds()).padStart(3, '0'),
  },

  // Calendar
  {
    token: 'week',
    description: 'Week of year (31)',
    category: 'Calendar',
    getValue: (date) => String(getWeekNumber(date)),
  },
  {
    token: 'iso-week',
    description: 'ISO week (W31)',
    category: 'Calendar',
    getValue: (date) => `W${String(getWeekNumber(date)).padStart(2, '0')}`,
  },
  {
    token: 'quarter',
    description: 'Quarter (Q3)',
    category: 'Calendar',
    getValue: (date) => `Q${getQuarter(date)}`,
  },
  {
    token: 'day-of-year',
    description: 'Day of year (211)',
    category: 'Calendar',
    getValue: (date) => String(getDayOfYear(date)),
  },
  {
    token: 'season',
    description: 'Season (Summer)',
    category: 'Calendar',
    getValue: (date) => getSeason(date),
  },

  // Timezone
  {
    token: 'timezone',
    description: 'Timezone abbr (PST)',
    category: 'Timezone',
    getValue: (date) => getTimezoneAbbr(date),
  },
  {
    token: 'utc-offset',
    description: 'UTC offset (-08:00)',
    category: 'Timezone',
    getValue: (date) => getUTCOffset(date),
  },
  {
    token: 'timezone-full',
    description: 'Full timezone name',
    category: 'Timezone',
    getValue: (date) => getTimezoneFull(date),
  },

  // Special
  {
    token: 'relative',
    description: 'Relative day (today)',
    category: 'Special',
    getValue: (date) => getRelativeDay(date),
  },
  {
    token: 'unix',
    description: 'Unix timestamp',
    category: 'Special',
    getValue: (date) => String(Math.floor(date.getTime() / 1000)),
  },
  {
    token: 'iso',
    description: 'ISO 8601 format',
    category: 'Special',
    getValue: (date) => date.toISOString(),
  },
];

// Create a map for fast token lookup
const tokenMap = new Map<string, TokenDefinition>();
TOKEN_DEFINITIONS.forEach(def => tokenMap.set(def.token, def));

export function parsePattern(pattern: string, date: Date, locale: string): string {
  return pattern.replace(/\{([^}]+)\}/g, (match, tokenName) => {
    const definition = tokenMap.get(tokenName);
    if (definition) {
      return definition.getValue(date, locale);
    }
    return match; // Return original if token not found
  });
}

export function getTokensByCategory(): Map<string, TokenDefinition[]> {
  const categories = new Map<string, TokenDefinition[]>();

  TOKEN_DEFINITIONS.forEach(def => {
    if (!categories.has(def.category)) {
      categories.set(def.category, []);
    }
    categories.get(def.category)!.push(def);
  });

  return categories;
}
