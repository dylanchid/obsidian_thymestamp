# Thymestamp

Insert custom-formatted timestamps into your Obsidian notes with powerful token-based formatting. Create multiple timestamp formats and assign hotkeys to each for quick access.

## Features

- **Custom Timestamp Formats**: Define multiple timestamp formats using intuitive token-based syntax
- **Token-Based Patterns**: Supports 30+ tokens covering dates, times, timezones, seasons, and more
- **Hotkey Support**: Assign custom hotkeys to each timestamp format for fast insertion
- **Output Options**: Insert directly at cursor or copy to clipboard
- **Format Preview**: See a live preview of your format before saving
- **Locale Aware**: Timestamps respect your system locale settings
- **Quick Access Ribbon**: Click the ribbon icon to insert your most recently used format

## Installation

1. Open Obsidian Settings → Community plugins
2. Search for "Thymestamp"
3. Click Install
4. Enable the plugin in the Community plugins list

## Usage

### Adding Timestamp Formats

1. Open Obsidian Settings (Ctrl/Cmd + ,)
2. Navigate to Thymestamp settings
3. Click "Add new format"
4. Enter a name for your format (e.g., "Date Only", "Full Datetime")
5. Create your pattern using tokens (see token reference below)
6. Choose output mode: "Insert at cursor" or "Copy to clipboard"
7. Optionally assign a hotkey to the format
8. Click Save

### Inserting Timestamps

You have several ways to insert timestamps:

- **Quick Ribbon Button**: Click the clock icon in the ribbon to insert your last-used format
- **Format Picker**: Run command "Pick timestamp format" to see all available formats
- **Direct Hotkey**: Use the assigned hotkey for any format
- **Command Palette**: Search for your format name in the command palette (Ctrl/Cmd + P)

### Token Reference

#### Days
- `{day}` - Full day name (Wednesday)
- `{day-abb}` - Abbreviated day (Wed)
- `{day-num}` - Day of week 1-7 (3)

#### Months
- `{month}` - Full month name (July)
- `{month-abb}` - Abbreviated month (Jul)
- `{month-num}` - Month number (7)
- `{month-pad}` - Month zero-padded (07)

#### Date
- `{date}` - Day of month (30)
- `{date-pad}` - Day zero-padded (03)
- `{date-ord}` - Day with ordinal (30th)

#### Year
- `{year}` - Full year (2026)
- `{year-short}` - Two-digit year (26)

#### Time (12-hour)
- `{time}` - Full 12h time (1:36 AM)
- `{hours}` - Hour 1-12 (1)
- `{hours-pad}` - Hour zero-padded (01)
- `{minutes}` - Minutes (36)
- `{seconds}` - Seconds (45)
- `{period}` - AM/PM
- `{period-lower}` - am/pm

#### Time (24-hour)
- `{time24}` - Full 24h time (13:36)
- `{hours24}` - Hour 0-23 (13)
- `{hours24-pad}` - Hour zero-padded (01)
- `{milliseconds}` - Milliseconds (123)

#### Calendar
- `{week}` - Week of year (31)
- `{iso-week}` - ISO week (W31)
- `{quarter}` - Quarter (Q3)
- `{day-of-year}` - Day of year (211)
- `{season}` - Season (Summer)

#### Timezone
- `{timezone}` - Timezone abbreviation (PST)
- `{utc-offset}` - UTC offset (-08:00)
- `{timezone-full}` - Full timezone name

#### Special
- `{relative}` - Relative day (today, tomorrow, yesterday, etc.)
- `{unix}` - Unix timestamp
- `{iso}` - ISO 8601 format

## Example Formats

Here are some common timestamp formats to get you started:

### Date Only
Pattern: `{month-pad}/{date-pad}/{year}`
Result: `01/03/2026`

### Date and Time
Pattern: `{month-pad}/{date-pad}/{year} {hours-pad}:{minutes} {period}`
Result: `01/03/2026 01:36 AM`

### ISO Format
Pattern: `{iso}`
Result: `2026-01-03T01:36:45.123Z`

### Log-Friendly
Pattern: `[{hours24-pad}:{minutes}:{seconds}]`
Result: `[01:36:45]`

### Full Timestamp
Pattern: `{day}, {month} {date-ord}, {year} at {time}`
Result: `Friday, January 30th, 2026 at 1:36 AM`

### Relative Date
Pattern: `{relative} at {time24}`
Result: `today at 13:36`

## Settings

### Format Management
- **Name**: Human-readable name for the format
- **Pattern**: Token-based pattern string
- **Output Mode**: Insert at cursor or copy to clipboard
- **Hotkey**: Optional keyboard shortcut for quick access

## Tips

1. **Live Preview**: The format settings tab shows a live preview of your current pattern
2. **Locale Aware**: Day and month names automatically adapt to your system locale
3. **Copy Mode**: Useful for formats you want to copy to clipboard instead of inserting
4. **Hotkey Assignment**: Assign single-key or modifier+key combinations for fast access
5. **Last Used Format**: The ribbon button remembers your most recently used format

## Keyboard Shortcuts

After assigning hotkeys in settings, you can use them anywhere in Obsidian:
- Your custom hotkey → Inserts your assigned format
- Default: Ctrl/Cmd + Shift + T → Pick timestamp format (configurable)

## Privacy

This plugin does not collect, send, or store any personal data. All timestamps are generated locally on your device.

## Support

For issues, feature requests, or feedback, please visit the plugin repository.

## License

MIT License - See LICENSE file for details

---

Enjoy adding timestamps to your notes with Thymestamp!
