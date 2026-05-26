'use strict';

var React2 = require('react');
var reactNative = require('react-native');
var Svg = require('react-native-svg');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React2__default = /*#__PURE__*/_interopDefault(React2);
var Svg__default = /*#__PURE__*/_interopDefault(Svg);

// src/components/BottomTab.tsx
function TabItemComponent({
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
  labelStyle
}) {
  const pressScale = React2.useRef(new reactNative.Animated.Value(1)).current;
  const iconScale = React2.useRef(new reactNative.Animated.Value(focused ? 1 : 0.85)).current;
  const iconTranslateY = React2.useRef(new reactNative.Animated.Value(focused ? -2 : 0)).current;
  const labelOpacity = React2.useRef(new reactNative.Animated.Value(focused ? 1 : 0.55)).current;
  const labelTranslateY = React2.useRef(new reactNative.Animated.Value(focused ? 0 : 3)).current;
  const colorAnim = React2.useRef(new reactNative.Animated.Value(focused ? 1 : 0)).current;
  React2.useEffect(() => {
    const toValue = focused ? 1 : 0;
    if (!isAnimated) {
      iconScale.setValue(focused ? 1 : 0.85);
      iconTranslateY.setValue(focused ? -2 : 0);
      labelOpacity.setValue(focused ? 1 : 0.55);
      labelTranslateY.setValue(focused ? 0 : 3);
      colorAnim.setValue(toValue);
      return;
    }
    reactNative.Animated.parallel([
      reactNative.Animated.timing(colorAnim, { toValue, duration: 200, useNativeDriver: false }),
      reactNative.Animated.spring(iconScale, { toValue: focused ? 1 : 0.85, useNativeDriver: true, tension: springTension, friction: springFriction }),
      reactNative.Animated.spring(iconTranslateY, { toValue: focused ? -2 : 0, useNativeDriver: true, tension: springTension, friction: springFriction }),
      reactNative.Animated.spring(labelTranslateY, { toValue: focused ? 0 : 3, useNativeDriver: true, tension: springTension, friction: springFriction }),
      reactNative.Animated.timing(labelOpacity, { toValue: focused ? 1 : 0.55, duration: 200, useNativeDriver: true })
    ]).start();
  }, [focused, isAnimated, springTension, springFriction]);
  const handlePressIn = () => {
    if (!isAnimated) return;
    reactNative.Animated.spring(pressScale, { toValue: 0.82, useNativeDriver: true, tension: 200, friction: 5 }).start();
  };
  const handlePressOut = () => {
    if (!isAnimated) return;
    reactNative.Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }).start();
  };
  const animatedIconColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor]
  });
  const animatedLabelColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveLabelColor, activeLabelColor]
  });
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.Pressable,
    {
      onPress,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      disabled: tab.disabled,
      style: styles.pressable,
      accessibilityRole: "tab",
      accessibilityState: { selected: focused },
      accessibilityLabel: tab.label
    },
    /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.View, { style: [styles.container, { transform: [{ scale: pressScale }] }] }, showIndicator && /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.View, { style: [
      styles.indicator,
      {
        backgroundColor: activeColor,
        opacity: colorAnim,
        transform: [{ scaleX: colorAnim }]
      }
    ] }), /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.View, { style: {
      transform: [{ scale: iconScale }, { translateY: iconTranslateY }],
      position: "relative"
    } }, /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.Text, { style: { color: animatedIconColor } }, tab.icon({ focused, color: focused ? activeColor : inactiveColor, size: iconSize })), tab.badge !== void 0 && tab.badge !== 0 && /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { style: styles.badge }, /* @__PURE__ */ React2__default.default.createElement(reactNative.Text, { style: styles.badgeText }, typeof tab.badge === "number" && tab.badge > 99 ? "99+" : tab.badge))), showLabel && /* @__PURE__ */ React2__default.default.createElement(
      reactNative.Animated.Text,
      {
        style: [
          styles.label,
          {
            fontSize: 10,
            color: animatedLabelColor,
            fontWeight: focused ? "600" : "400",
            opacity: labelOpacity,
            transform: [{ translateY: labelTranslateY }]
          },
          labelStyle
        ],
        numberOfLines: 1
      },
      tab.label
    ))
  );
}
var styles = reactNative.StyleSheet.create({
  pressable: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { alignItems: "center", justifyContent: "center", paddingTop: 8, paddingBottom: 4, gap: 3 },
  indicator: { position: "absolute", top: -8, width: 20, height: 3, borderRadius: 2 },
  label: { letterSpacing: 0.2 },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3
  },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" }
});

// src/components/BottomTab.tsx
var D = {
  tabBarHeight: 60,
  iconSize: 24,
  activeColor: "#007AFF",
  inactiveColor: "#8E8E93",
  backgroundColor: "#FFFFFF",
  borderColor: "#C6C6C8",
  circleColor: "#F0B429",
  circleSize: 56,
  circleIconColor: "#FFFFFF",
  springTension: 160,
  springFriction: 14,
  labelSize: 10,
  slidingIndicatorColor: "#F0B429",
  slidingIndicatorWidth: 52,
  slidingIndicatorHeight: 36
};
var CIRCLE_ABOVE = 16;
function buildNotchPath(w, h, cx, r) {
  const nr = r + 10, depth = r - CIRCLE_ABOVE + 10, s = 24;
  return [
    `M0,0`,
    `H${cx - nr - s}`,
    `C${cx - nr},0 ${cx - nr},${depth} ${cx},${depth}`,
    `C${cx + nr},${depth} ${cx + nr},0 ${cx + nr + s},0`,
    `H${w}`,
    `V${h}`,
    `H0`,
    `Z`
  ].join(" ");
}
function BottomTab({
  tabs,
  activeKey,
  onTabPress,
  // animation
  animated = true,
  springTension = D.springTension,
  springFriction = D.springFriction,
  // circle
  featuredTabKey,
  featuredTabColor = D.circleColor,
  featuredTabSize = D.circleSize,
  circleIconColor = D.circleIconColor,
  showCircleShadow = true,
  // tab bar
  tabBarHeight = D.tabBarHeight,
  backgroundColor = D.backgroundColor,
  showBorder = true,
  borderColor = D.borderColor,
  showShadow = true,
  // icons
  iconSize = D.iconSize,
  activeColor = D.activeColor,
  inactiveColor = D.inactiveColor,
  // labels
  showLabel = true,
  labelStyle,
  activeLabelColor,
  inactiveLabelColor,
  labelSize = D.labelSize,
  // sliding pill
  slidingIndicator = false,
  slidingIndicatorColor = D.slidingIndicatorColor,
  slidingIndicatorWidth = D.slidingIndicatorWidth,
  slidingIndicatorHeight = D.slidingIndicatorHeight,
  // safe area & container
  safeAreaBottom = 0,
  style
}) {
  var _a, _b, _c, _d;
  const [containerWidth, setContainerWidth] = React2.useState(0);
  const circleR = featuredTabSize / 2;
  const extraH = circleR + CIRCLE_ABOVE;
  const resolvedActiveLabelColor = activeLabelColor != null ? activeLabelColor : activeColor;
  const resolvedInactiveLabelColor = inactiveLabelColor != null ? inactiveLabelColor : inactiveColor;
  const isSlidingCircle = !featuredTabKey;
  const circleLeftAnim = React2.useRef(null);
  const [notchCx, setNotchCx] = React2.useState(0);
  const listenerId = React2.useRef(null);
  const getTargetLeft = (key, w) => {
    const idx = tabs.findIndex((t) => t.key === key);
    const tabW = w / tabs.length;
    return tabW * idx + tabW / 2 - circleR;
  };
  React2.useEffect(() => {
    if (containerWidth === 0) return;
    const initLeft = getTargetLeft(activeKey, containerWidth);
    if (circleLeftAnim.current === null) {
      circleLeftAnim.current = new reactNative.Animated.Value(initLeft);
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
  React2.useEffect(() => {
    if (!isSlidingCircle || !circleLeftAnim.current || containerWidth === 0) return;
    const toLeft = getTargetLeft(activeKey, containerWidth);
    if (!animated) {
      circleLeftAnim.current.setValue(toLeft);
      return;
    }
    reactNative.Animated.spring(circleLeftAnim.current, {
      toValue: toLeft,
      useNativeDriver: false,
      tension: springTension,
      friction: springFriction
    }).start();
  }, [activeKey, containerWidth, isSlidingCircle, animated, springTension, springFriction]);
  const pressScale = React2.useRef(new reactNative.Animated.Value(1)).current;
  const onPressIn = () => {
    if (!animated) return;
    reactNative.Animated.spring(pressScale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 5 }).start();
  };
  const onPressOut = () => {
    if (!animated) return;
    reactNative.Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }).start();
  };
  const floatScale = React2.useRef(new reactNative.Animated.Value(1)).current;
  const floatTranslateY = React2.useRef(new reactNative.Animated.Value(0)).current;
  const prevActive = React2.useRef(activeKey);
  React2.useEffect(() => {
    if (!animated || !featuredTabKey || activeKey !== featuredTabKey || prevActive.current === featuredTabKey) {
      prevActive.current = activeKey;
      return;
    }
    reactNative.Animated.sequence([
      reactNative.Animated.spring(floatTranslateY, { toValue: -6, useNativeDriver: true, tension: 300, friction: 6 }),
      reactNative.Animated.spring(floatTranslateY, { toValue: 0, useNativeDriver: true, tension: 200, friction: 7 })
    ]).start();
    prevActive.current = activeKey;
  }, [activeKey, animated, featuredTabKey]);
  const pillX = React2.useRef(new reactNative.Animated.Value(0)).current;
  const pillScale = React2.useRef(new reactNative.Animated.Value(1)).current;
  React2.useEffect(() => {
    if (!slidingIndicator || containerWidth === 0) return;
    const activeIdx = tabs.findIndex((t) => t.key === activeKey);
    const tabW = containerWidth / tabs.length;
    const toX = tabW * activeIdx + (tabW - slidingIndicatorWidth) / 2;
    if (!animated) {
      pillX.setValue(toX);
      return;
    }
    reactNative.Animated.parallel([
      reactNative.Animated.spring(pillX, { toValue: toX, useNativeDriver: true, tension: springTension, friction: springFriction }),
      reactNative.Animated.sequence([
        reactNative.Animated.timing(pillScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
        reactNative.Animated.spring(pillScale, { toValue: 1, tension: 200, friction: 7, useNativeDriver: true })
      ])
    ]).start();
  }, [activeKey, containerWidth, slidingIndicator, animated]);
  React2.useEffect(() => {
    if (!slidingIndicator || containerWidth === 0) return;
    const activeIdx = tabs.findIndex((t) => t.key === activeKey);
    const tabW = containerWidth / tabs.length;
    pillX.setValue(tabW * activeIdx + (tabW - slidingIndicatorWidth) / 2);
  }, [containerWidth]);
  const featuredIdx = featuredTabKey ? tabs.findIndex((t) => t.key === featuredTabKey) : -1;
  const hasFeatured = featuredIdx >= 0 && containerWidth > 0;
  const tabWidth = containerWidth > 0 ? containerWidth / tabs.length : 0;
  const featuredCx = hasFeatured ? tabWidth * featuredIdx + tabWidth / 2 : 0;
  const effectiveCx = isSlidingCircle ? notchCx : featuredCx;
  const totalHeight = tabBarHeight + extraH + safeAreaBottom;
  const pillTop = (tabBarHeight - slidingIndicatorHeight) / 2 - (showLabel ? 8 : 0);
  const shadowStyle = showShadow ? (_a = reactNative.Platform.select({
    ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 },
    android: { elevation: 8 }
  })) != null ? _a : {} : {};
  const circleShadow = showCircleShadow ? (_b = reactNative.Platform.select({
    ios: { shadowColor: featuredTabColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    android: { elevation: 6 }
  })) != null ? _b : {} : {};
  return /* @__PURE__ */ React2__default.default.createElement(
    reactNative.View,
    {
      onLayout: (e) => setContainerWidth(e.nativeEvent.layout.width),
      style: [{ height: totalHeight }, style]
    },
    containerWidth > 0 && effectiveCx > 0 && !slidingIndicator ? /* @__PURE__ */ React2__default.default.createElement(
      Svg__default.default,
      {
        width: containerWidth,
        height: tabBarHeight,
        style: { position: "absolute", bottom: safeAreaBottom, left: 0 }
      },
      /* @__PURE__ */ React2__default.default.createElement(Svg.Path, { d: buildNotchPath(containerWidth, tabBarHeight, effectiveCx, circleR), fill: backgroundColor })
    ) : /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { style: [reactNative.StyleSheet.absoluteFill, {
      backgroundColor,
      borderTopWidth: showBorder ? reactNative.StyleSheet.hairlineWidth : 0,
      borderTopColor: borderColor
    }, shadowStyle] }),
    slidingIndicator && containerWidth > 0 && /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.View, { style: {
      position: "absolute",
      top: extraH + pillTop,
      width: slidingIndicatorWidth,
      height: slidingIndicatorHeight,
      borderRadius: slidingIndicatorHeight / 2,
      backgroundColor: slidingIndicatorColor,
      transform: [{ translateX: pillX }, { scale: pillScale }]
    } }),
    isSlidingCircle && circleLeftAnim.current && containerWidth > 0 && !slidingIndicator && /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.View, { style: [styles2.circle, circleShadow, {
      width: featuredTabSize,
      height: featuredTabSize,
      borderRadius: circleR,
      backgroundColor: featuredTabColor,
      top: 0,
      left: circleLeftAnim.current,
      transform: [{ scale: pressScale }]
    }] }, /* @__PURE__ */ React2__default.default.createElement(
      reactNative.Pressable,
      {
        onPress: () => onTabPress(activeKey),
        onPressIn,
        onPressOut,
        style: styles2.circlePressable
      },
      (_c = tabs.find((t) => t.key === activeKey)) == null ? void 0 : _c.icon({ focused: true, color: circleIconColor, size: iconSize })
    )),
    hasFeatured && !slidingIndicator && /* @__PURE__ */ React2__default.default.createElement(reactNative.Animated.View, { style: [styles2.circle, circleShadow, {
      width: featuredTabSize,
      height: featuredTabSize,
      borderRadius: circleR,
      backgroundColor: featuredTabColor,
      top: 0,
      left: featuredCx - circleR,
      transform: [{ scale: floatScale }, { translateY: floatTranslateY }]
    }] }, /* @__PURE__ */ React2__default.default.createElement(
      reactNative.Pressable,
      {
        onPress: () => onTabPress(featuredTabKey),
        onPressIn: () => animated && reactNative.Animated.spring(floatScale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 6 }).start(),
        onPressOut: () => animated && reactNative.Animated.spring(floatScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }).start(),
        style: styles2.circlePressable
      },
      (_d = tabs[featuredIdx]) == null ? void 0 : _d.icon({ focused: activeKey === featuredTabKey, color: circleIconColor, size: iconSize })
    )),
    /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { style: [styles2.tabsRow, {
      height: tabBarHeight,
      position: "absolute",
      bottom: safeAreaBottom,
      left: 0,
      right: 0
    }] }, tabs.map((tab) => {
      const focused = tab.key === activeKey;
      if (tab.key === featuredTabKey) {
        return /* @__PURE__ */ React2__default.default.createElement(reactNative.View, { key: tab.key, style: styles2.featuredSlot }, showLabel && /* @__PURE__ */ React2__default.default.createElement(
          reactNative.Text,
          {
            style: [
              styles2.featuredLabel,
              {
                fontSize: labelSize,
                color: focused ? resolvedActiveLabelColor : resolvedInactiveLabelColor
              },
              labelStyle
            ],
            numberOfLines: 1
          },
          tab.label
        ));
      }
      return /* @__PURE__ */ React2__default.default.createElement(
        TabItemComponent,
        {
          key: tab.key,
          tab,
          focused,
          onPress: () => onTabPress(tab.key),
          activeColor: slidingIndicator && focused ? "#FFFFFF" : activeColor,
          inactiveColor,
          activeLabelColor: resolvedActiveLabelColor,
          inactiveLabelColor: resolvedInactiveLabelColor,
          labelSize,
          iconSize,
          showLabel,
          showIndicator: false,
          labelStyle,
          animated,
          springTension,
          springFriction
        }
      );
    }))
  );
}
var styles2 = reactNative.StyleSheet.create({
  tabsRow: { flexDirection: "row", alignItems: "stretch" },
  circle: { position: "absolute", alignItems: "center", justifyContent: "center" },
  circlePressable: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  featuredSlot: { flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 8 },
  featuredLabel: { fontWeight: "400", letterSpacing: 0.2 }
});

exports.BottomTab = BottomTab;
exports.TabItemComponent = TabItemComponent;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map