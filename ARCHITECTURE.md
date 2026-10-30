# Thymestamp Architecture

## Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Thymestamp Plugin                         │
│                      (main.ts)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Core Methods:                                               │
│  • executeFormat() - Insert/copy timestamps                  │
│  • toggleFormatFavorite() - Star management                  │
│  • duplicateFormat() - Clone formats                         │
│  • exportFormats() / importFormats() - Data exchange         │
│  • addFormatFromPreset() - Preset installation              │
│                                                              │
└───────────────────┬──────────────────┬──────────────────────┘
                    │                  │
        ┌───────────▼──────────┐     ┌▼─────────────────────┐
        │  Ribbon Icon (🕐)    │     │  Command Palette     │
        │  - Last used format  │     │  - All commands      │
        └──────────────────────┘     └──────────────────────┘
                    │
        ┌───────────▼──────────────────────────────────────┐
        │                                                   │
        │             User Interaction                      │
        │                                                   │
        └────┬──────────────┬──────────────┬────────────┬──┘
             │              │              │            │
    ┌────────▼──────┐  ┌───▼──────────┐  ┌▼───────────▼┐  ┌─────────────┐
    │ Format Picker │  │ Preset       │  │  Settings  │  │ Direct      │
    │ Modal         │  │ Library      │  │  Tab       │  │ Commands    │
    │               │  │ Modal        │  │            │  │             │
    │ • Search      │  │              │  │ • General  │  │ • Hotkeys   │
    │ • Filter      │  │ • 17 Presets │  │ • Import/  │  │ • Each      │
    │ • Keyboard    │  │ • Categories │  │   Export   │  │   format    │
    │ • Preview     │  │ • Preview    │  │ • Formats  │  │             │
    │ • Categories  │  │ • Copy       │  │ • Tokens   │  │             │
    └───────────────┘  └──────────────┘  └────────────┘  └─────────────┘
             │              │                    │
             └──────────────┴────────────────────┘
                            │
                  ┌─────────▼─────────┐
                  │                   │
                  │   Data Layer      │
                  │                   │
                  └─────────┬─────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐      ┌──────▼──────┐     ┌─────▼─────┐
   │ Tokens   │      │ Types       │     │ Natural   │
   │ Engine   │      │ & Presets   │     │ Parser    │
   │          │      │             │     │           │
   │ • 30+    │      │ • Interfaces│     │ • Validate│
   │   tokens │      │ • 17 Presets│     │ • Parse   │
   │ • Parse  │      │ • Categories│     │ • Suggest │
   │ • Format │      │ • Defaults  │     │ • Preview │
   └──────────┘      └─────────────┘     └───────────┘
```

## Data Flow

### Inserting a Timestamp
```
User Action → Command/Hotkey/Ribbon
    ↓
executeFormat(format)
    ↓
parsePattern(pattern, date, locale)
    ↓
Token Engine (30+ token handlers)
    ↓
Final Timestamp String
    ↓
Insert to Editor OR Copy to Clipboard
    ↓
Update: usageCount++, lastUsedFormatId
```

### Using Format Picker
```
User: Open Picker Command
    ↓
FormatPickerModal.open()
    ↓
Display: Formats (sorted: favorites → usage → alpha)
    ↓
User: Search/Filter/Navigate
    ↓
Real-time: Filter & Update Display
    ↓
User: Select Format (click/enter)
    ↓
executeFormat() → Insert Timestamp
```

### Adding from Preset Library
```
User: Browse Presets Command
    ↓
PresetLibraryModal.open()
    ↓
Display: 17 Presets with Category Filters
    ↓
User: Filter by Category
    ↓
User: Click "Add Format"
    ↓
addFormatFromPreset(preset)
    ↓
Create TimestampFormat from Preset
    ↓
Add to settings.formats[]
    ↓
Register Command
    ↓
Save & Refresh UI
```

## Type Hierarchy

```
ThymestampSettings
├── formats: TimestampFormat[]
│   ├── id: string
│   ├── name: string
│   ├── pattern: string
│   ├── outputMode: 'insert' | 'clipboard'
│   ├── category?: string
│   ├── isFavorite?: boolean
│   ├── usageCount?: number
│   └── order?: number
├── lastUsedFormatId: string | null
├── categories: FormatCategory[]
│   ├── id: string
│   ├── name: string
│   └── collapsed?: boolean
└── showPreviewsInPicker: boolean

FormatPreset
├── name: string
├── description: string
├── pattern: string
└── category: string

TokenDefinition
├── token: string
├── description: string
├── category: string
└── getValue: (date, locale) => string
```

## File Organization

```
thymestamp/
├── src/
│   ├── main.ts                    # Main plugin class
│   ├── types.ts                   # Interfaces & constants
│   ├── tokens.ts                  # Token engine (30+ tokens)
│   ├── settings.ts                # Settings tab UI
│   ├── format-picker-modal.ts     # Enhanced picker
│   ├── preset-library-modal.ts    # Preset browser
│   └── natural-parser.ts          # NLP foundation
├── styles.css                     # All styling
├── manifest.json                  # Plugin metadata
├── README.md                      # User documentation
├── CHANGELOG.md                   # Version history
├── IMPLEMENTATION.md              # This implementation
├── ARCHITECTURE.md                # This file
└── LICENSE                        # MIT license
```

## Key Features by File

### main.ts
- Plugin lifecycle
- Command registration
- Format execution
- Ribbon icon
- Import/Export
- Format management (duplicate, favorite, etc.)

### types.ts
- TypeScript interfaces
- Default settings
- 17 preset definitions
- Category definitions

### tokens.ts
- 30+ token definitions
- Pattern parsing engine
- Token categorization
- Locale-aware formatting

### settings.ts
- Settings UI rendering
- Format CRUD operations
- Import/Export UI
- Token reference display
- Pattern validation UI

### format-picker-modal.ts
- Searchable format picker
- Keyboard navigation
- Category grouping
- Live previews
- Smart sorting

### preset-library-modal.ts
- Preset browser
- Category filtering
- Visual cards
- One-click installation

### natural-parser.ts
- Pattern validation
- Natural language parsing (foundation)
- Token detection
- Preview generation

## Extension Points

### Adding New Tokens
1. Add to TOKEN_DEFINITIONS in tokens.ts
2. Update README token reference
3. Pattern validation auto-updates

### Adding New Presets
1. Add to FORMAT_PRESETS in types.ts
2. Update README examples
3. Appears in library automatically

### Adding New Categories
1. Add to DEFAULT_CATEGORIES in types.ts
2. Update UI as needed
3. Available in dropdowns automatically

### Custom Modals
1. Extend Modal from Obsidian
2. Implement onOpen() and onClose()
3. Add styling to styles.css
4. Register command in main.ts

## Performance Considerations

- Token parsing is O(n) where n = pattern length
- Format picker filters in O(m) where m = number of formats
- Real-time updates debounced for UX
- Category grouping uses Map for O(1) lookups
- Usage counts stored locally, no external calls

## Future Enhancements

### Natural Language Parser
- Full implementation of type-as-you-want
- "Monday, January 3rd" → "{day}, {month} {date-ord}"
- Intelligent token detection
- Suggestion system

### Advanced Features
- Conditional tokens: `{period==AM?morning:afternoon}`
- Date math: `{date+1}`, `{month-1}`
- Custom token API
- Community preset sharing
- Format history/undo
- Batch operations

### UI/UX
- Drag-and-drop reordering
- Format groups/folders
- Visual pattern builder
- More keyboard shortcuts
- Touch gestures (mobile)
