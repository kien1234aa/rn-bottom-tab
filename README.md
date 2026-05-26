# @kien0g/rn-bottom-tab

A lightweight, customizable Bottom Tab Bar component for React Native — supports icons, badges, animated indicators, and full TypeScript support.

## Preview

```
┌──────────────────────────────────────┐
│                                      │
│           (App content here)         │
│                                      │
├──────────────────────────────────────┤
│  ▲              ▲              ▲     │  ← active indicator
│  🏠            🔍              👤    │
│ Home          Search         Profile │
└──────────────────────────────────────┘
```

## Installation

```bash
npm install @kien0g/rn-bottom-tab
# or
yarn add @kien0g/rn-bottom-tab
```

> **Peer dependencies:** `react >= 17`, `react-native >= 0.68`

---

## Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BottomTab } from '@kien0g/rn-bottom-tab';
import type { TabItem } from '@kien0g/rn-bottom-tab';

const tabs: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: ({ color, size }) => <Text style={{ color, fontSize: size }}>🏠</Text>,
  },
  {
    key: 'search',
    label: 'Search',
    icon: ({ color, size }) => <Text style={{ color, fontSize: size }}>🔍</Text>,
    badge: 3,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: ({ color, size }) => <Text style={{ color, fontSize: size }}>👤</Text>,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View style={{ flex: 1 }}>
      {/* Your screen content */}
      <View style={{ flex: 1 }} />

      <BottomTab
        tabs={tabs}
        activeKey={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
  );
}
```

---

## Using with vector icons (recommended)

```tsx
import Icon from 'react-native-vector-icons/Ionicons';

const tabs: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: ({ color, size, focused }) => (
      <Icon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
    ),
  },
];
```

---

## Props

### `BottomTab`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | **required** | Array of tab definitions |
| `activeKey` | `string` | **required** | Key of the currently active tab |
| `onTabPress` | `(key: string) => void` | **required** | Called when a tab is tapped |
| `tabBarHeight` | `number` | `60` | Height of the tab bar |
| `iconSize` | `number` | `24` | Icon size in dp |
| `activeColor` | `string` | `'#007AFF'` | Color for active tab |
| `inactiveColor` | `string` | `'#8E8E93'` | Color for inactive tabs |
| `backgroundColor` | `string` | `'#FFFFFF'` | Background color |
| `showLabel` | `boolean` | `true` | Show/hide tab labels |
| `showBorder` | `boolean` | `true` | Show top border line |
| `showIndicator` | `boolean` | `true` | Show animated top indicator dot |
| `style` | `StyleProp<ViewStyle>` | — | Extra style for the container |
| `labelStyle` | `StyleProp<TextStyle>` | — | Extra style for labels |

### `TabItem`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | `string` | ✅ | Unique identifier |
| `label` | `string` | ✅ | Display label |
| `icon` | `(props: TabIconProps) => ReactNode` | ✅ | Icon renderer |
| `badge` | `number \| string` | — | Badge count (0 = hidden) |
| `disabled` | `boolean` | — | Disable this tab |

### `TabIconProps`

```ts
{
  focused: boolean;
  color: string;
  size: number;
}
```

---

## License

MIT © Your Name
