import React, {ReactNode, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle as SvgCircle} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

export type AnimatedProgressCircleProps = {
  /** Progress value from 0 to 1. Ignored when indeterminate is true. */
  progress?: number;
  /** Diameter of the circle in pixels */
  size: number;
  /** Stroke width of the circle */
  thickness?: number;
  /** Color of the progress arc */
  color?: string;
  /** Color of the unfilled portion */
  unfilledColor?: string;
  /** Fill color of the center */
  fill?: string;
  /** Direction of progress animation */
  direction?: 'clockwise' | 'counter-clockwise';
  /** Whether to animate progress changes */
  animated?: boolean;
  /** Duration of progress animation in ms */
  animationDuration?: number;
  /** Show spinning indeterminate animation */
  indeterminate?: boolean;
  /** Duration of one spin cycle in ms (for indeterminate mode) */
  spinDuration?: number;
  /** Content to render in the center */
  children?: ReactNode;
};

export const AnimatedProgressCircle = ({
  progress = 0,
  size,
  thickness = 4,
  color = '#3498db',
  unfilledColor = '#ecf0f1',
  fill = 'transparent',
  direction = 'clockwise',
  animated = true,
  animationDuration = 300,
  indeterminate = false,
  spinDuration = 1000,
  children,
}: AnimatedProgressCircleProps) => {
  const radius = (size - thickness) / 2;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const center = size / 2;
  const isCounterClockwise = direction === 'counter-clockwise';

  // Shared values for animations
  const progressValue = useSharedValue(Math.max(0, Math.min(1, progress)));
  const spinRotation = useSharedValue(0);

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

  // Handle indeterminate spinning animation
  useEffect(() => {
    if (indeterminate) {
      spinRotation.value = withRepeat(
        withTiming(360, {
          duration: spinDuration,
          easing: Easing.linear,
        }),
        -1, // Infinite repeat
        false, // Don't reverse
      );
    } else {
      cancelAnimation(spinRotation);
      spinRotation.value = 0;
    }

    return () => {
      cancelAnimation(spinRotation);
    };
  }, [indeterminate, spinDuration, spinRotation]);

  // Animated style for spinning container (indeterminate mode)
  const spinnerContainerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{rotate: `${spinRotation.value}deg`}],
    };
  }, [spinRotation]);

  // Animated props for determinate progress
  const determinateProps = useAnimatedProps(() => {
    'worklet';
    const offset = circumference * (1 - progressValue.value);
    return {
      strokeDashoffset: isCounterClockwise ? -offset : offset,
    };
  }, [circumference, isCounterClockwise]);

  // Animated props for indeterminate spinning (rotation handled by container)
  const indeterminateProps = useAnimatedProps(() => {
    'worklet';
    // Show about 25% of the circle for the spinning arc
    const arcLength = circumference * 0.25;
    const gapLength = circumference * 0.75;
    return {
      strokeDasharray: [arcLength, gapLength],
      strokeDashoffset: 0,
    };
  }, [circumference]);

  const animatedProps = indeterminate ? indeterminateProps : determinateProps;

  const renderSvg = () => (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <SvgCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={unfilledColor}
        strokeWidth={thickness}
        fill={fill}
      />
      {/* Animated progress/spinner arc */}
      <AnimatedSvgCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        fill="transparent"
        strokeDasharray={
          indeterminate ? undefined : `${circumference}, ${circumference}`
        }
        animatedProps={animatedProps}
        strokeLinecap="round"
        rotation={-90}
        origin={`${center}, ${center}`}
      />
    </Svg>
  );

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      {indeterminate ? (
        <Animated.View style={spinnerContainerStyle}>
          {renderSvg()}
        </Animated.View>
      ) : (
        renderSvg()
      )}
      {children && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.childrenContainer}>{children}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
