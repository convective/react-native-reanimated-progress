import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, LayoutChangeEvent, DimensionValue} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
  interpolate,
} from 'react-native-reanimated';

export type AnimatedProgressBarProps = {
  /** Progress value from 0 to 1. Ignored when indeterminate is true. */
  progress?: number;
  /** Width of the progress bar. If null or 0, fills container width via auto-measure. */
  width?: number | null;
  /** Height of the progress bar */
  height?: number;
  /** Color of the progress indicator */
  color?: string;
  /** Color of the unfilled portion */
  unfilledColor?: string;
  /** Border radius of the bar */
  borderRadius?: number;
  /** Border width of the bar */
  borderWidth?: number;
  /** Border color of the bar */
  borderColor?: string;
  /** Whether to animate progress changes */
  animated?: boolean;
  /** Duration of progress animation in ms */
  animationDuration?: number;
  /** Show indeterminate animation */
  indeterminate?: boolean;
  /** Duration of one indeterminate cycle in ms */
  indeterminateDuration?: number;
};

export const AnimatedProgressBar = ({
  progress = 0,
  width = null,
  height = 4,
  color = '#3498db',
  unfilledColor = '#ecf0f1',
  borderRadius = 0,
  borderWidth = 0,
  borderColor,
  animated = true,
  animationDuration = 300,
  indeterminate = false,
  indeterminateDuration = 1000,
}: AnimatedProgressBarProps) => {
  const progressValue = useSharedValue(Math.max(0, Math.min(1, progress)));
  const indeterminateValue = useSharedValue(0);
  const containerWidth = useSharedValue(width || 0);

  // Update progress when prop changes
  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    if (animated && !indeterminate) {
      progressValue.value = withTiming(clampedProgress, {
        duration: animationDuration,
      });
    } else {
      progressValue.value = clampedProgress;
    }
  }, [progress, animated, animationDuration, indeterminate, progressValue]);

  // Handle indeterminate animation
  useEffect(() => {
    if (indeterminate) {
      indeterminateValue.value = withRepeat(
        withTiming(1, {
          duration: indeterminateDuration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1, // Infinite repeat
        true, // Reverse (ping-pong)
      );
    } else {
      cancelAnimation(indeterminateValue);
      indeterminateValue.value = 0;
    }

    return () => {
      cancelAnimation(indeterminateValue);
    };
  }, [indeterminate, indeterminateDuration, indeterminateValue]);

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!width) {
      containerWidth.value = event.nativeEvent.layout.width;
    }
  };

  // Update container width when prop changes
  useEffect(() => {
    if (width) {
      containerWidth.value = width;
    }
  }, [width, containerWidth]);

  // Animated style for determinate progress
  const determinateStyle = useAnimatedStyle(() => {
    'worklet';
    const barWidth = containerWidth.value * progressValue.value;
    return {
      width: barWidth,
    };
  }, []);

  // Animated style for indeterminate progress
  const indeterminateStyle = useAnimatedStyle(() => {
    'worklet';
    const barWidth = containerWidth.value * 0.3; // 30% of container width
    const maxTranslate = containerWidth.value - barWidth;
    const translateX = interpolate(
      indeterminateValue.value,
      [0, 1],
      [0, maxTranslate],
    );
    return {
      width: barWidth,
      transform: [{translateX}],
    };
  }, []);

  const barStyle = indeterminate ? indeterminateStyle : determinateStyle;

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        height,
        width: (width || '100%') as DimensionValue,
        backgroundColor: unfilledColor,
        borderRadius,
        borderWidth,
        borderColor: borderColor ?? unfilledColor,
        overflow: 'hidden' as const,
      },
    ],
    [height, width, unfilledColor, borderRadius, borderWidth, borderColor],
  );

  const progressBarStyle = useMemo(
    () => [
      styles.progressBar,
      {
        height: '100%' as const,
        backgroundColor: color,
        borderRadius: Math.max(0, borderRadius - borderWidth),
      },
    ],
    [color, borderRadius, borderWidth],
  );

  return (
    <View style={containerStyle} onLayout={handleLayout}>
      <Animated.View style={[progressBarStyle, barStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
