import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { TabItemComponent } from './TabItem';
import type { BottomTabProps } from '../types';

// ─── Defaults ────────────────────────────────────────────────────────────────
const D = {
  tabBarHeight:          60,
  iconSize:              24,
  activeColor:           '#007AFF',
  inactiveColor:         '#8E8E93',
  backgroundColor:       '#FFFFFF',
  borderColor:           '#C6C6C8',
  circleColor:           '#F0B429',
  circleSize:            56,
  circleIconColor:       '#FFFFFF',
  springTension:         160,
  springFriction:        14,
  labelSize:             10,
  slidingIndicatorColor: '#F0B429',
  slidingIndicatorWidth: 52,
  slidingIndicatorHeight:36,
} as const;

const CIRCLE_ABOVE = 16;

function buildNotchPath(w: number, h: number, cx: number, r: number): string {
  const nr = r + 10, depth = r - CIRCLE_ABOVE + 10, s = 24;
  return [
    `M0,0`, `H${cx-nr-s}`,
    `C${cx-nr},0 ${cx-nr},${depth} ${cx},${depth}`,
    `C${cx+nr},${depth} ${cx+nr},0 ${cx+nr+s},0`,
    `H${w}`, `V${h}`, `H0`, `Z`,
  ].join(' ');
}

export function BottomTab({
  tabs,
  activeKey,
  onTabPress,
  // animation
  animated          = true,
  springTension     = D.springTension,
  springFriction    = D.springFriction,
  // circle
  featuredTabKey,
  featuredTabColor  = D.circleColor,
  featuredTabSize   = D.circleSize,
  circleIconColor   = D.circleIconColor,
  showCircleShadow  = true,
  // tab bar
  tabBarHeight      = D.tabBarHeight,
  backgroundColor   = D.backgroundColor,
  showBorder        = true,
  borderColor       = D.borderColor,
  showShadow        = true,
  // icons
  iconSize          = D.iconSize,
  activeColor       = D.activeColor,
  inactiveColor     = D.inactiveColor,
  // labels
  showLabel         = true,
  labelStyle,
  activeLabelColor,
  inactiveLabelColor,
  labelSize         = D.labelSize,
  // sliding pill
  slidingIndicator        = false,
  slidingIndicatorColor   = D.slidingIndicatorColor,
  slidingIndicatorWidth   = D.slidingIndicatorWidth,
  slidingIndicatorHeight  = D.slidingIndicatorHeight,
  // safe area & container
  safeAreaBottom    = 0,
  style,
}: BottomTabProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const circleR = featuredTabSize / 2;
  const extraH  = circleR + CIRCLE_ABOVE;

  // ─── Resolved label colors ────────────────────────────────────────────────
  const resolvedActiveLabelColor   = activeLabelColor   ?? activeColor;
  const resolvedInactiveLabelColor = inactiveLabelColor ?? inactiveColor;

  // ─── Sliding circle: cx animates between tabs ─────────────────────────────
  const isSlidingCircle = !featuredTabKey;
  const circleLeftAnim  = useRef<Animated.Value | null>(null);
  const [notchCx, setNotchCx] = useState(0);
  const listenerId = useRef<string | null>(null);

  const getTargetLeft = (key: string, w: number) => {
    const idx  = tabs.findIndex(t => t.key === key);
    const tabW = w / tabs.length;
    return tabW * idx + tabW / 2 - circleR;
  };

  // Init animated value on first layout
  useEffect(() => {
    if (containerWidth === 0) return;
    const initLeft = getTargetLeft(activeKey, containerWidth);
    if (circleLeftAnim.current === null) {
      circleLeftAnim.current = new Animated.Value(initLeft);
    }
    if (listenerId.current) circleLeftAnim.current.removeListener(listenerId.current);
    listenerId.current = circleLeftAnim.current.addListener(({ value }) => {
      setNotchCx(value + circleR);
    });
    setNotchCx(initLeft + circleR);
    return () => {
      if (circleLeftAnim.current && listenerId.current) {
        circleLeftAnim.current.removeListener(listenerId.current);
      }
    };
  }, [containerWidth]);

  // Animate circle to new active tab
  useEffect(() => {
    if (!isSlidingCircle || !circleLeftAnim.current || containerWidth === 0) return;
    const toLeft = getTargetLeft(activeKey, containerWidth);
    if (!animated) {
      circleLeftAnim.current.setValue(toLeft);
      return;
    }
    Animated.spring(circleLeftAnim.current, {
      toValue: toLeft,
      useNativeDriver: false,
      tension: springTension,
      friction: springFriction,
    }).start();
  }, [activeKey, containerWidth, isSlidingCircle, animated, springTension, springFriction]);

  // ─── Circle press animation ───────────────────────────────────────────────
  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => {
    if (!animated) return;
    Animated.spring(pressScale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 5 }).start();
  };
  const onPressOut = () => {
    if (!animated) return;
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }).start();
  };

  // ─── Fixed featured-tab bounce ────────────────────────────────────────────
  const floatScale      = useRef(new Animated.Value(1)).current;
  const floatTranslateY = useRef(new Animated.Value(0)).current;
  const prevActive      = useRef(activeKey);
  useEffect(() => {
    if (!animated || !featuredTabKey || activeKey !== featuredTabKey || prevActive.current === featuredTabKey) {
      prevActive.current = activeKey;
      return;
    }
    Animated.sequence([
      Animated.spring(floatTranslateY, { toValue: -6, useNativeDriver: true, tension: 300, friction: 6 }),
      Animated.spring(floatTranslateY, { toValue: 0,  useNativeDriver: true, tension: 200, friction: 7 }),
    ]).start();
    prevActive.current = activeKey;
  }, [activeKey, animated, featuredTabKey]);

  // ─── Sliding pill (flat design) ───────────────────────────────────────────
  const pillX     = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!slidingIndicator || containerWidth === 0) return;
    const activeIdx = tabs.findIndex(t => t.key === activeKey);
    const tabW      = containerWidth / tabs.length;
    const toX       = tabW * activeIdx + (tabW - slidingIndicatorWidth) / 2;
    if (!animated) { pillX.setValue(toX); return; }
    Animated.parallel([
      Animated.spring(pillX, { toValue: toX, useNativeDriver: true, tension: springTension, friction: springFriction }),
      Animated.sequence([
        Animated.timing(pillScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
        Animated.spring(pillScale, { toValue: 1, tension: 200, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, [activeKey, containerWidth, slidingIndicator, animated]);

  useEffect(() => {
    if (!slidingIndicator || containerWidth === 0) return;
    const activeIdx = tabs.findIndex(t => t.key === activeKey);
    const tabW      = containerWidth / tabs.length;
    pillX.setValue(tabW * activeIdx + (tabW - slidingIndicatorWidth) / 2);
  }, [containerWidth]);

  // ─── Layout ───────────────────────────────────────────────────────────────
  const featuredIdx = featuredTabKey ? tabs.findIndex(t => t.key === featuredTabKey) : -1;
  const hasFeatured = featuredIdx >= 0 && containerWidth > 0;
  const tabWidth    = containerWidth > 0 ? containerWidth / tabs.length : 0;
  const featuredCx  = hasFeatured ? tabWidth * featuredIdx + tabWidth / 2 : 0;
  const effectiveCx = isSlidingCircle ? notchCx : featuredCx;
  const totalHeight = tabBarHeight + extraH + safeAreaBottom;
  const pillTop     = (tabBarHeight - slidingIndicatorHeight) / 2 - (showLabel ? 8 : 0);

  // ─── Shadow styles ────────────────────────────────────────────────────────
  const shadowStyle = showShadow ? Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 },
    android: { elevation: 8 },
  }) ?? {} : {};

  const circleShadow = showCircleShadow ? Platform.select({
    ios:     { shadowColor: featuredTabColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    android: { elevation: 6 },
  }) ?? {} : {};

  return (
    <View
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
      style={[{ height: totalHeight }, style]}
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      {containerWidth > 0 && effectiveCx > 0 && !slidingIndicator ? (
        <Svg width={containerWidth} height={tabBarHeight}
          style={{ position: 'absolute', bottom: safeAreaBottom, left: 0 }}>
          <Path d={buildNotchPath(containerWidth, tabBarHeight, effectiveCx, circleR)} fill={backgroundColor} />
        </Svg>
      ) : (
        <View style={[StyleSheet.absoluteFill, {
          backgroundColor,
          borderTopWidth: showBorder ? StyleSheet.hairlineWidth : 0,
          borderTopColor: borderColor,
        }, shadowStyle]} />
      )}

      {/* ── Sliding pill ──────────────────────────────────────────── */}
      {slidingIndicator && containerWidth > 0 && (
        <Animated.View style={{
          position: 'absolute',
          top: extraH + pillTop,
          width: slidingIndicatorWidth,
          height: slidingIndicatorHeight,
          borderRadius: slidingIndicatorHeight / 2,
          backgroundColor: slidingIndicatorColor,
          transform: [{ translateX: pillX }, { scale: pillScale }],
        }} />
      )}

      {/* ── Sliding circle ────────────────────────────────────────── */}
      {isSlidingCircle && circleLeftAnim.current && containerWidth > 0 && !slidingIndicator && (
        <Animated.View style={[styles.circle, circleShadow, {
          width: featuredTabSize,
          height: featuredTabSize,
          borderRadius: circleR,
          backgroundColor: featuredTabColor,
          top: 0,
          left: circleLeftAnim.current,
          transform: [{ scale: pressScale }],
        }]}>
          <Pressable onPress={() => onTabPress(activeKey)}
            onPressIn={onPressIn} onPressOut={onPressOut}
            style={styles.circlePressable}>
            {tabs.find(t => t.key === activeKey)?.icon({ focused: true, color: circleIconColor, size: iconSize })}
          </Pressable>
        </Animated.View>
      )}

      {/* ── Fixed featured circle ─────────────────────────────────── */}
      {hasFeatured && !slidingIndicator && (
        <Animated.View style={[styles.circle, circleShadow, {
          width: featuredTabSize,
          height: featuredTabSize,
          borderRadius: circleR,
          backgroundColor: featuredTabColor,
          top: 0,
          left: featuredCx - circleR,
          transform: [{ scale: floatScale }, { translateY: floatTranslateY }],
        }]}>
          <Pressable
            onPress={() => onTabPress(featuredTabKey!)}
            onPressIn={() => animated && Animated.spring(floatScale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 6 }).start()}
            onPressOut={() => animated && Animated.spring(floatScale, { toValue: 1,   useNativeDriver: true, tension: 200, friction: 5 }).start()}
            style={styles.circlePressable}>
            {tabs[featuredIdx]?.icon({ focused: activeKey === featuredTabKey, color: circleIconColor, size: iconSize })}
          </Pressable>
        </Animated.View>
      )}

      {/* ── Tab row ───────────────────────────────────────────────── */}
      <View style={[styles.tabsRow, {
        height: tabBarHeight,
        position: 'absolute',
        bottom: safeAreaBottom, left: 0, right: 0,
      }]}>
        {tabs.map(tab => {
          const focused = tab.key === activeKey;

          if (tab.key === featuredTabKey) {
            return (
              <View key={tab.key} style={styles.featuredSlot}>
                {showLabel && (
                  <Text
                    style={[
                      styles.featuredLabel,
                      {
                        fontSize: labelSize,
                        color: focused ? resolvedActiveLabelColor : resolvedInactiveLabelColor,
                      },
                      labelStyle,
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                )}
              </View>
            );
          }

          return (
            <TabItemComponent
              key={tab.key}
              tab={tab}
              focused={focused}
              onPress={() => onTabPress(tab.key)}
              activeColor={slidingIndicator && focused ? '#FFFFFF' : activeColor}
              inactiveColor={inactiveColor}
              activeLabelColor={resolvedActiveLabelColor}
              inactiveLabelColor={resolvedInactiveLabelColor}
              labelSize={labelSize}
              iconSize={iconSize}
              showLabel={showLabel}
              showIndicator={false}
              labelStyle={labelStyle}
              animated={animated}
              springTension={springTension}
              springFriction={springFriction}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow:        { flexDirection: 'row', alignItems: 'stretch' },
  circle:         { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  circlePressable:{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  featuredSlot:   { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  featuredLabel:  { fontWeight: '400', letterSpacing: 0.2 },
});
