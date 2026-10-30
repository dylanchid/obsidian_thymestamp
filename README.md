# Thymestamp

Insert custom-formatted timestamps into your Obsidian notes with powerful token-based formatting. Create multiple timestamp formats, organize them with categories, and access a library of popular presets.

## ✨ Features

### Core Functionality
- **Custom Timestamp Formats**: Define unlimited timestamp formats using intuitive token-based syntax
- **30+ Tokens**: Comprehensive token library covering dates, times, timezones, seasons, and more
- **Hotkey Support**: Assign custom hotkeys to each timestamp format for instant insertion
- **Output Options**: Insert at cursor or copy to clipboard
- **Live Preview**: See real-time preview of your format in settings
- **Locale Aware**: Timestamps automatically respect your system locale settings

### Format Organization (NEW in v2.0)
- **Categories**: Organize formats into General, Journal, Development, and Personal categories
- **Favorites System**: Star ⭐ your most-used formats for quick access
- **Usage Tracking**: See how often you use each format
- **Smart Sorting**: Favorites and frequently-used formats appear first

### Enhanced Format Picker (NEW in v2.0)
- **Modal Interface**: Beautiful, searchable format picker with keyboard navigation
- **Live Search**: Filter formats by name, pattern, or category
- **Visual Previews**: See what your timestamp will look like before inserting
- **Keyboard Navigation**: Arrow keys and Enter for power users

### Preset Library (NEW in v2.0)
- **17 Ready-to-Use Formats**: Popular presets across 4 categories
- **One-Click Installation**: Add any preset to your formats instantly
- **Category Filtering**: Browse presets by category
- **Live Previews**: See examples before adding

### Import/Export (NEW in v2.0)
- **Export Formats**: Backup or share your format collections as JSON
- **Import Formats**: Load format collections from others or restore backups
- **Easy Sharing**: Share your favorite formats with the community

### Quick Access
- **Ribbon Icon**: Click the clock icon to insert your last-used format
- **Command Palette**: All formats available via command palette
- **Direct Commands**: Each format becomes its own command

## Installation

1. Open Obsidian Settings → Community plugins
2. Search for "Thymestamp"
3. Click Install
4. Enable the plugin in the Community plugins list

## Usage

### Quick Start

1. **Click the ribbon icon** (🕐) to insert a timestamp using the last format you used
2. **Open command palette** (Ctrl/Cmd + P) and search "Pick timestamp format" to see all formats
3. **Browse presets** by opening Settings → Thymestamp → Browse Presets button

### Adding Timestamp Formats

#### From Preset Library (Easiest)
1. Open Obsidian Settings → Thymestamp
2. Click "📚 Browse Presets" button
3. Filter by category or browse all
4. Click "Add Format" on any preset you like

#### Create Custom Format
1. Open Obsidian Settings → Thymestamp
2. Click "+ Add Format" button
3. Enter a name (e.g., "My Journal Format")
4. Enter your pattern using tokens (e.g., `{day}, {month} {date}`)
5. Optionally assign a category and mark as favorite
6. Choose output mode (insert or clipboard)
7. Pattern validation will show if your format is valid

#### Duplicate Existing Format
1. Find any format in settings
2. Click "Duplicate" button
3. Modify the duplicate as needed

### Inserting Timestamps

Multiple ways to insert timestamps:

- **Ribbon Icon**: Click clock icon for last-used format
- **Format Picker**: Command palette → "Pick timestamp format"
  - Search by name or pattern
  - Navigate with arrow keys
  - Press Enter to insert
- **Direct Hotkey**: Assign hotkeys in Obsidian's Hotkeys settings
- **Command Palette**: Each format has its own command

### Managing Formats

#### Favorites
- Click the ⭐ star button on any format to mark as favorite
- Favorites appear first in the format picker
- Great for your 2-3 most-used formats

#### Categories
- Assign formats to categories for better organization
- Categories: General, Journal, Development, Personal
- Category headers appear in the format picker

#### Usage Statistics
- Each format tracks how many times you've used it
- Usage count appears as a badge in settings
- Helps identify your most valuable formats

### Import/Export

#### Export Your Formats
1. Settings → Thymestamp → Import/Export section
2. Click "Export" button
3. JSON is copied to clipboard
4. Save to file or share with others

#### Import Formats
1. Copy JSON format collection
2. Settings → Thymestamp → Import/Export section
3. Paste JSON in the textarea
4. Click "Import" button
5. All formats will be added (duplicates won't be removed)

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

## Example Formats & Presets

The plugin includes 17 built-in presets across 4 categories. Here are some highlights:

### General Formats
**ISO 8601**
- Pattern: `{iso}`
- Result: `2026-01-04T09:23:26.813Z`
- Use case: Standard timestamps, data interchange

**US Date**
- Pattern: `{month-pad}/{date-pad}/{year}`
- Result: `01/04/2026`
- Use case: American date format

**EU Date**
- Pattern: `{date-pad}/{month-pad}/{year}`
- Result: `04/01/2026`
- Use case: European date format

### Journal Formats
**Daily Note Title**
- Pattern: `{year}-{month-pad}-{date-pad}`
- Result: `2026-01-04`
- Use case: Perfect for daily note filenames

**Journal Entry**
- Pattern: `{day}, {month} {date-ord}, {year} at {time}`
- Result: `Saturday, January 4th, 2026 at 9:23 AM`
- Use case: Human-readable journal headers

**Time Log**
- Pattern: `[{hours24-pad}:{minutes}:{seconds}]`
- Result: `[09:23:26]`
- Use case: Timestamped logs and notes

**Weekly Note**
- Pattern: `{year}-{iso-week}`
- Result: `2026-W01`
- Use case: Weekly note organization

### Development Formats
**Zettelkasten ID**
- Pattern: `{year}{month-pad}{date-pad}{hours24-pad}{minutes}{seconds}`
- Result: `20260104092326`
- Use case: Unique note IDs, Zettelkasten method

**Git Commit Style**
- Pattern: `{year}-{month-pad}-{date-pad} {hours24-pad}:{minutes}`
- Result: `2026-01-04 09:23`
- Use case: Commit messages, changelogs

**Filename Safe**
- Pattern: `{year}{month-pad}{date-pad}_{hours24-pad}{minutes}{seconds}`
- Result: `20260104_092326`
- Use case: Safe for filenames, no special characters

**Version Tag**
- Pattern: `v{year}.{month-num}.{date}`
- Result: `v2026.1.4`
- Use case: Version numbers, release tags

### Personal Formats
**Friendly Date**
- Pattern: `{month} {date}, {year}`
- Result: `January 4, 2026`
- Use case: Easy-to-read dates

**Relative Time**
- Pattern: `{relative} at {time}`
- Result: `today at 9:23 AM`
- Use case: Natural language timestamps

**Casual DateTime**
- Pattern: `{day-abb} {hours}:{minutes} {period-lower}`
- Result: `Sat 9:23 am`
- Use case: Quick, informal timestamps

**Full Context**
- Pattern: `{day}, {month} {date-ord}, {year} - {time} ({timezone})`
- Result: `Saturday, January 4th, 2026 - 9:23 AM (PST)`
- Use case: Complete timestamp with timezone

## Settings

### General
- **Show previews in picker**: Toggle timestamp previews in the format picker modal

### Format Management
- **Name**: Human-readable name for the format
- **Category**: Organize into General, Journal, Development, or Personal
- **Pattern**: Token-based pattern string
- **Output Mode**: Insert at cursor or copy to clipboard
- **Favorite**: Star frequently-used formats
- **Hotkey**: Assign via Obsidian's Hotkeys settings

### Actions
- **Duplicate**: Clone a format to create variations
- **Delete**: Remove formats you don't need
- **Export/Import**: Share or backup format collections

## Tips & Tricks

1. **Start with Presets**: Browse the preset library before creating custom formats
2. **Use Favorites**: Star your top 2-3 formats for instant access in the picker
3. **Pattern Validation**: Watch for the green ✓ to ensure your pattern is valid
4. **Category Organization**: Assign categories to keep your format list organized
5. **Usage Tracking**: Check usage counts to identify which formats you actually use
6. **Live Preview**: See exactly what your timestamp will look like in settings
7. **Locale Aware**: Day and month names automatically adapt to your system locale
8. **Copy Mode**: Set output to "clipboard" for formats you don't want inserted
9. **Hotkey Power**: Assign hotkeys to your most-used formats
10. **Keyboard Navigation**: Use arrow keys in the picker for speed
11. **Export for Backup**: Regularly export your formats as backup
12. **Share Collections**: Export and share your format collections with others

## Keyboard Shortcuts

Default shortcuts (customizable in Obsidian's Hotkeys settings):
- **Pick timestamp format**: Opens the searchable format picker
- **Browse format presets**: Opens the preset library
- **Insert: [Format Name]**: Each format gets its own command

Tips:
- Assign hotkeys to your 2-3 most-used formats
- Use the picker (with search) for occasional formats
- Arrow keys + Enter for quick selection in picker

## Privacy

This plugin does not collect, send, or store any personal data. All timestamps are generated locally on your device. Format configurations are stored in your vault's plugin data folder.

## Support & Contributing

- **Issues**: Report bugs on the GitHub repository
- **Feature Requests**: Suggest improvements via GitHub Issues
- **Share Presets**: Share your favorite format collections with the community
- **Pull Requests**: Contributions welcome!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and detailed release notes.

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Made with ⏰ for the Obsidian community**

Enjoy adding timestamps to your notes with Thymestamp!
