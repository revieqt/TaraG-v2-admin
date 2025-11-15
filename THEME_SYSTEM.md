# Theme System Documentation - TaraAdmin

## Overview
The TaraAdmin theme system has been replicated from TaraG with full parity. It provides a flexible theming solution with support for:
- Light/Dark/Device theme modes
- Persistent theme storage (localStorage)
- Animated theme transitions
- System color scheme detection
- CSS theme application

## Files Created

### 1. `src/hooks/useTheme.ts`
The core hook that manages theme state and persistence.

**Key Functions:**
- `useTheme()` - Main hook to access and manage theme state
- `initializeThemeCache()` - Pre-initialize theme before component render (prevents flash)
- `clearThemeCache()` - Clear cached theme (for debugging)

**Theme Types:**
```typescript
type ThemeType = 'device' | 'light' | 'dark'
```

**Storage Key:** `selectedTheme` in localStorage

**Hook Return Value:**
```typescript
{
  theme: ThemeType;                                          // Current selected theme
  setTheme: (theme: ThemeType) => Promise<void>;             // Save theme to storage
  setThemeAnimated: (theme, callback?) => Promise<void>;     // Animated theme change
  isLoading: boolean;                                         // Initial load state
  isAnimating: boolean;                                       // Transition animation state
  THEME_TYPES: { DEVICE, LIGHT, DARK };                      // Available theme constants
  deviceTheme: 'light' | 'dark';                             // System preference
}
```

### 2. `src/context/ThemeContext.tsx`
React Context wrapper around the `useTheme` hook.

**Exports:**
- `ThemeProvider` - Context provider component
- `useTheme()` - Hook to access theme context

**Setup in App:**
Wrap your app root with `ThemeProvider`:
```tsx
import { ThemeProvider } from './context/ThemeContext';

<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

### 3. `src/hooks/useThemeColor.ts`
Hook to access colors from the theme.

**Signature:**
```typescript
useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string
```

**Parameters:**
- `props` - Override colors for light/dark modes
- `colorName` - Color key from Colors constant (e.g., 'text', 'background', 'primary')

**Return Value:** RGB hex color string

## Usage Examples

### Basic Setup
Already integrated in `src/main.tsx`:
```tsx
<ThemeProvider>
  <SessionProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SessionProvider>
</ThemeProvider>
```

### Access Theme State
```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { theme, setTheme, THEME_TYPES } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(THEME_TYPES.LIGHT)}>Light</button>
      <button onClick={() => setTheme(THEME_TYPES.DARK)}>Dark</button>
      <button onClick={() => setTheme(THEME_TYPES.DEVICE)}>Auto</button>
    </div>
  );
}
```

### Get Theme Colors
```tsx
import { useThemeColor } from '@/hooks/useThemeColor';

function MyComponent() {
  const bgColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const customAccent = useThemeColor(
    { light: '#ff0000', dark: '#00ff00' },
    'accent'
  );

  return (
    <div style={{ backgroundColor: bgColor, color: textColor }}>
      Custom: {customAccent}
    </div>
  );
}
```

### Animated Theme Change
```tsx
const { setThemeAnimated, THEME_TYPES } = useTheme();

const handleThemeSwitch = () => {
  // Optional animation callback
  const fadeOut = () => {
    document.body.style.opacity = '0';
  };
  
  setThemeAnimated(THEME_TYPES.DARK, fadeOut)
    .then(() => {
      document.body.style.opacity = '1';
    });
};
```

## Available Colors

Colors are defined in `src/constants/Colors.ts`:

```typescript
Colors = {
  light: {
    text: '#2C3333',
    background: '#F4F4F4',
    icon: '#687076',
    primary: '#fff',
    secondary: '#0065F8',
    accent: '#00CAFF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#020D19',
    icon: '#9BA1A6',
    primary: '#001C30',
    secondary: '#0065F8',
    accent: '#00CAFF',
  },
}
```

## Features

### 1. In-Memory Cache
- Prevents UI flash on app reload
- Initialized before component render
- Can be pre-initialized with `initializeThemeCache()`

### 2. localStorage Persistence
- Stores selected theme in browser storage
- Survives page reloads
- Storage key: `selectedTheme`

### 3. System Theme Detection
- Detects OS dark/light mode preference
- Uses `window.matchMedia('(prefers-color-scheme: dark)')`
- Automatically applied when theme is 'device'

### 4. CSS Integration
- Applies `data-theme` attribute to `document.documentElement`
- Adds/removes `dark` class for Tailwind CSS compatibility
- Enables CSS custom properties based on theme

### 5. Animated Transitions
- `setThemeAnimated()` allows smooth theme switching
- Optional animation callback for custom transitions
- Prevents multiple simultaneous animations

## Implementation Details

### Theme Resolution
The actual theme used depends on selection:
- `'light'` → Always use light colors
- `'dark'` → Always use dark colors
- `'device'` → Use OS preference (detected via matchMedia)

### Storage Management
- Initially loads theme from localStorage
- Falls back to 'device' if no saved preference
- Uses in-memory cache to prevent race conditions
- Cache cleared before saving new theme

### Component Hierarchy
```
ThemeProvider (useTheme hook)
  └─ ThemeContext
      └─ useTheme() access point
```

## Related Components

The theme system is already integrated with:
- **GradientBlobs.tsx** - Uses `useThemeColor()` for accent colors
- **main.tsx** - Wraps app with `ThemeProvider`

## Parity with TaraG

This implementation maintains 100% API compatibility with TaraG's theme system:
- Same hook signatures
- Same context structure
- Same theme types and constants
- Same color definitions
- Adapted for web (localStorage instead of AsyncStorage, matchMedia instead of React Native's useColorScheme)

## Troubleshooting

### Theme not persisting
- Check that localStorage is enabled
- Verify theme is saved with `setTheme()`, not just state update

### Flash on page load
- Use `initializeThemeCache()` early in app lifecycle if needed
- Ensure `ThemeProvider` wraps all theme-consuming components

### useThemeColor returns wrong color
- Verify color name exists in Colors constant
- Check that component is inside ThemeProvider
- Check colorName spelling (case-sensitive)

## Migration Guide

To use theme colors in existing components:

**Before:**
```tsx
<div style={{ backgroundColor: '#F4F4F4' }}>
```

**After:**
```tsx
import { useThemeColor } from '@/hooks/useThemeColor';

function Component() {
  const bgColor = useThemeColor({}, 'background');
  return <div style={{ backgroundColor: bgColor }}>
}
```

## Future Enhancements

Possible additions (if needed):
- Custom color definitions per theme
- Transition duration configuration
- Multiple simultaneous animation callbacks
- LocalStorage utility helpers
- Redux/Zustand integration
