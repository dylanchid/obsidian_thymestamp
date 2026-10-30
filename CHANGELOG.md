# Changelog

All notable changes to the Thymestamp plugin will be documented in this file.

## [2.0.0] - 2026-01-04

### 🎉 Major Features

#### Enhanced Format Picker
- **New Modal Interface**: Replaced basic menu with a full-featured modal
- **Live Search**: Filter formats by name, pattern, or category
- **Keyboard Navigation**: Use arrow keys and Enter to select formats
- **Visual Previews**: See timestamp previews for each format before selecting
- **Category Headers**: Organized display with category groupings
- **Smart Sorting**: Favorites first, then by usage count, then alphabetically

#### Format Organization
- **Categories**: Organize formats into categories (General, Journal, Development, Personal)
- **Favorites System**: Star your most-used formats with ⭐
- **Usage Tracking**: See how many times you've used each format
- **Duplicate Format**: One-click duplication of existing formats
- **Drag Context**: Visual organization in settings

#### Preset Library
- **17 Ready-to-Use Presets**: Popular timestamp formats across 4 categories
  - **General**: ISO 8601, Unix timestamp, US/EU date formats
  - **Journal**: Daily notes, journal entries, time logs, weekly notes
  - **Development**: Zettelkasten IDs, Git commit style, version tags, filename-safe
  - **Personal**: Friendly dates, relative time, casual formats
- **Browse & Preview**: Visual library with live previews
- **One-Click Installation**: Add any preset to your formats instantly
- **Category Filtering**: Filter presets by category

#### Import/Export
- **Export Formats**: Copy all formats as JSON to share or backup
- **Import Formats**: Import format collections from JSON
- **Share Collections**: Easily share format configurations with others

#### Enhanced Settings UI
- **Format Validation**: Real-time pattern validation with error messages
- **Category Selection**: Assign categories to formats
- **Collapsible Cards**: Better organization of format settings
- **Action Buttons**: Quick access to duplicate, favorite, and delete
- **Usage Statistics**: See usage count badges on formats

#### Natural Language Parser (Foundation)
- **Pattern Validation**: Validates token patterns in real-time
- **Error Detection**: Identifies unknown tokens
- **Preview Generation**: Safe preview rendering with error handling
- **Future Ready**: Foundation for natural language input parsing

### 🎨 UI/UX Improvements
- Completely redesigned settings interface
- Modern card-based format display
- Better visual hierarchy with icons and badges
- Improved mobile responsiveness
- Smooth animations and transitions
- Color-coded validation states

### 🔧 Technical Improvements
- Modular architecture with separate modal components
- Usage tracking for each format
- Better TypeScript typing throughout
- Improved state management
- Enhanced error handling

### 📚 Documentation
- Added comprehensive CHANGELOG
- Updated README with new features
- Inline code documentation

### 🐛 Bug Fixes
- Ribbon icon now properly implemented (was missing in v1.0)
- Format picker positioned correctly
- Settings reload properly after changes

## [1.0.0] - Initial Release

### Features
- Custom timestamp formats with 30+ tokens
- Token-based pattern system
- Multiple format support
- Hotkey assignment
- Live preview in settings
- Insert at cursor or copy to clipboard
- Locale-aware formatting
- Command palette integration

