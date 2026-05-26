import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TabItem as TabItemType } from '../types';
import type { StyleProp, TextStyle } from 'react-native';

interface TabItemComponentProps {
  tab: TabItemType;
  focused: boolean;
  onPress: () => void;
  // colors
  activeColor: string;
  inactiveColor: string;
  activeLabelColor: string;
  inactiveLabelColor: string;
  // sizing
  iconSize: number;
  labelSize: number;
  // visibility
  showLabel: boolean;
  showIndicator: boolean;
  // animation
  animated: boolean;
  springTension: number;
  springFriction: number;
  // style
  labelStyle?: StyleProp<TextStyle>;
}

export function TabItemComponent({
  tab,
  focused,
  onPress,
  activeColor,
  inactiveColor,
  activeLabelColor,
  inactiveLabelColor,
  iconSize,
  labelSize,
  showLabel,
  showIndicator,
  animated: isAnimated,
  springTension,
  springFriction,
  labelStyle,
}: TabItemComponentProps) {
  // ─── Animated values ──────────────────────────────────────────────────────
  const pressScale      = useRef(new Animated.Value(1)).current;
  const iconScale       = useRef(new Animated.Value(focused ? 1 : 0.85)).current;
  const iconTranslateY  = useRef(new Animated.Value(focused ? -2 : 0)).current;
  const labelOpacity    = useRef(new Animated.Value(focused ? 1 : 0.55)).current;
  const labelTranslateY = useRef(new Animated.Value(focused ? 0 : 3)).current;
  const colorAnim       = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    const toValue = focused ? 1 : 0;

    if (!isAnimated) {
      iconScale.setValue(focused ? 1 : 0.85);
      iconTranslateY.setValue(focused ? -2 : 0);
      labelOpacity.setValue(focused ? 1 : 0.55);
      labelTranslateY.setValue(focused ? 0 : 3);
      colorAnim.setValue(toValue);
      return;
    }

    Animated.parallel([
      Animated.timing(colorAnim, { toValue, duration: 200, useNativeDriver: false }),
      Animated.spring(iconScale,       { toValue: focused ? 1 : 0.85, useNativeDriver: true, tension: springTension, friction: springFriction }),
      Animated.spring(iconTranslateY,  { toValue: focused ? -2 : 0,   useNativeDriver: true, tension: springTension, friction: springFriction }),
      Animated.spring(labelTranslateY, { toValue: focused ? 0 : 3,    useNativeDriver: true, tension: springTension, friction: springFriction }),
      Animated.timing(labelOpacity,    { toValue: focused ? 1 : 0.55, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [focused, isAnimated, springTension, springFriction]);

  const handlePressIn = () => {
    if (!isAnimated) return;
    Animated.spring(pressScale, { toValue: 0.82, useNativeDriver: true, tension: 200, friction: 5 }).start();
  };
  const handlePressOut = () => {
    if (!isAnimated) return;
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }).start();
  };

  const animatedIconColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });
  const animatedLabelColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveLabelColor, activeLabelColor],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={tab.disabled}
      style={styles.pressable}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={tab.label}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: pressScale }] }]}>

        {/* Top indicator dot */}
        {showIndicator && (
          <Animated.View style={[
            styles.indicator,
            {
              backgroundColor: activeColor,
              opacity: colorAnim,
              transform: [{ scaleX: colorAnim }],
            },
          ]} />
        )}

        {/* Icon */}
        <Animated.View style={{
          transform: [{ scale: iconScale }, { translateY: iconTranslateY }],
          position: 'relative',
        }}>
          <Animated.Text style={{ color: animatedIconColor }}>
            {tab.icon({ focused, color: focused ? activeColor : inactiveColor, size: iconSize })}
          </Animated.Text>

          {/* Badge */}
          {tab.badge !== undefined && tab.badge !== 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Label */}
        {showLabel && (
          <Animated.Text
            style={[
              styles.label,
              {
                fontSize: 10,
                color: animatedLabelColor,
                fontWeight: focused ? '600' : '400',
                opacity: labelOpacity,
                transform: [{ translateY: labelTranslateY }],
              },
              labelStyle,
            ]}
            numberOfLines={1}
          >
            {tab.label}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container:  { alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 4, gap: 3 },
  indicator:  { position: 'absolute', top: -8, width: 20, height: 3, borderRadius: 2 },
  label:      { letterSpacing: 0.2 },
  badge: {
    position: 'absolute', top: -5, right: -8,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText:  { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});
