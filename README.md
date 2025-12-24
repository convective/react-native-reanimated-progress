# react-native-animated-progress

Smooth, performant progress indicators for React Native built with `react-native-reanimated` and `react-native-svg`. All animations run on the UI thread for 60fps performance.

## Features

- **AnimatedProgressCircle** - Circular progress with determinate and indeterminate (spinner) modes
- **AnimatedProgressBar** - Linear progress bar with determinate and indeterminate modes
- **UI Thread Animations** - Powered by Reanimated worklets for smooth 60fps performance
- **Fully Customizable** - Colors, sizes, thickness, animation duration, direction
- **TypeScript Support** - Full type definitions included
- **Lightweight** - No unnecessary dependencies, just peer deps you likely already have

## Why This Package?

Unlike `react-native-progress` which uses JS thread animations, this package leverages `react-native-reanimated` worklets to run all animations on the native UI thread. This means:

- No dropped frames during animations
- Smooth performance even when JS thread is busy
- Better battery efficiency
- Consistent animation timing

## Installation

```bash
npm install react-native-animated-progress
# or
yarn add react-native-animated-progress
```

### Peer Dependencies

```bash
npm install react-native-svg react-native-reanimated
```

## Quick Start

```tsx
import { AnimatedProgressCircle, AnimatedProgressBar } from 'react-native-animated-progress';

// Determinate circle (75% complete)
<AnimatedProgressCircle progress={0.75} size={100} />

// Indeterminate spinner
<AnimatedProgressCircle indeterminate size={100} />

// Progress bar
<AnimatedProgressBar progress={0.5} height={4} />
```

## Components

### AnimatedProgressCircle

A circular progress indicator with support for both determinate and indeterminate (spinning) modes.

```tsx
// Determinate progress
<AnimatedProgressCircle
  progress={0.75}
  size={100}
  thickness={8}
  color="#3498db"
/>

// Indeterminate spinner
<AnimatedProgressCircle
  indeterminate
  size={100}
  thickness={8}
  color="#3498db"
/>

// With children
<AnimatedProgressCircle progress={0.5} size={100}>
  <Text>50%</Text>
</AnimatedProgressCircle>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | `0` | Progress value from 0 to 1 |
| `size` | `number` | Required | Diameter of the circle in pixels |
| `thickness` | `number` | `4` | Stroke width of the circle |
| `color` | `string` | `'#3498db'` | Color of the progress arc |
| `unfilledColor` | `string` | `'#ecf0f1'` | Color of the unfilled portion |
| `fill` | `string` | `'transparent'` | Fill color of the center |
| `direction` | `'clockwise' \| 'counter-clockwise'` | `'clockwise'` | Direction of progress |
| `animated` | `boolean` | `true` | Whether to animate progress changes |
| `animationDuration` | `number` | `300` | Duration of progress animation in ms |
| `indeterminate` | `boolean` | `false` | Show spinning animation |
| `spinDuration` | `number` | `1000` | Duration of one spin cycle in ms |
| `children` | `ReactNode` | - | Content to render in the center |

### AnimatedProgressBar

A linear progress bar with support for both determinate and indeterminate modes.

```tsx
// Determinate progress
<AnimatedProgressBar
  progress={0.75}
  width={200}
  height={4}
  color="#3498db"
/>

// Indeterminate
<AnimatedProgressBar
  indeterminate
  width={200}
  height={4}
  color="#3498db"
/>

// Full width (fills container)
<AnimatedProgressBar
  progress={0.5}
  height={4}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | `0` | Progress value from 0 to 1 |
| `width` | `number \| null` | `null` | Width of the bar (null = fill container) |
| `height` | `number` | `4` | Height of the bar |
| `color` | `string` | `'#3498db'` | Color of the progress indicator |
| `unfilledColor` | `string` | `'#ecf0f1'` | Color of the unfilled portion |
| `borderRadius` | `number` | `0` | Border radius of the bar |
| `borderWidth` | `number` | `0` | Border width of the bar |
| `borderColor` | `string` | - | Border color (defaults to unfilledColor) |
| `animated` | `boolean` | `true` | Whether to animate progress changes |
| `animationDuration` | `number` | `300` | Duration of progress animation in ms |
| `indeterminate` | `boolean` | `false` | Show indeterminate animation |
| `indeterminateDuration` | `number` | `1000` | Duration of indeterminate cycle in ms |

## License

MIT
