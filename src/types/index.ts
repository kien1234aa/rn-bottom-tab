import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface TabItem {
  /** Unique key for this tab */
  key: string;
  /** Label text shown below the icon */
  label: string;
  /** Icon renderer — receives focused, color, size */
  icon: (props: TabIconProps) => ReactNode;
  /** Badge count. Pass 0 to hide. */
  badge?: number | string;
  /** Disable interaction for this tab */
  disabled?: boolean;
}

export interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export interface BottomTabProps {
  // ─── Required ────────────────────────────────────────────────────────────
  tabs: TabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;

  // ─── Animation ───────────────────────────────────────────────────────────
  /** Enable/disable all animations (default: true) */
  animated?: boolean;
  /** Spring stiffness — higher = snappier (default: 160) */
  springTension?: number;
  /** Spring damping — higher = less bouncy (default: 14) */
  springFriction?: number;

  // ─── Floating circle ─────────────────────────────────────────────────────
  /**
   * Key of the tab that renders as a fixed floating circle above the notch.
   * When omitted, the circle slides between all tabs automatically.
   */
  featuredTabKey?: string;
  /** Background color of the floating circle (default: '#F0B429') */
  featuredTabColor?: string;
  /** Diameter of the floating circle in dp (default: 56) */
  featuredTabSize?: number;
  /** Icon color inside the circle (default: '#FFFFFF') */
  circleIconColor?: string;
  /** Show drop-shadow under the circle (default: true) */
  showCircleShadow?: boolean;

  // ─── Tab bar ─────────────────────────────────────────────────────────────
  /** Height of the tab bar in dp (default: 60) */
  tabBarHeight?: number;
  /** Background color of the tab bar (default: '#FFFFFF') */
  backgroundColor?: string;
  /** Show the hairline border at the top (default: true) */
  showBorder?: boolean;
  /** Color of the top border (default: '#C6C6C8') */
  borderColor?: string;
  /** Show the shadow above the tab bar (default: true) */
  showShadow?: boolean;

  // ─── Icons ───────────────────────────────────────────────────────────────
  /** Icon size in dp (default: 24) */
  iconSize?: number;
  /** Icon/label color when active (default: '#007AFF') */
  activeColor?: string;
  /** Icon/label color when inactive (default: '#8E8E93') */
  inactiveColor?: string;

  // ─── Labels ──────────────────────────────────────────────────────────────
  /** Show label text below icons (default: true) */
  showLabel?: boolean;
  /** Extra style applied to all labels */
  labelStyle?: StyleProp<TextStyle>;
  /** Label color when active — overrides activeColor for labels only */
  activeLabelColor?: string;
  /** Label color when inactive — overrides inactiveColor for labels only */
  inactiveLabelColor?: string;
  /** Label font size in dp (default: 10) */
  labelSize?: number;

  // ─── Sliding pill (alternative indicator style) ───────────────────────────
  /** Show a sliding pill indicator instead of the curved notch (default: false) */
  slidingIndicator?: boolean;
  /** Color of the sliding pill (default: '#F0B429') */
  slidingIndicatorColor?: string;
  /** Width of the pill in dp (default: 52) */
  slidingIndicatorWidth?: number;
  /** Height of the pill in dp (default: 36) */
  slidingIndicatorHeight?: number;

  // ─── Safe area & container ───────────────────────────────────────────────
  /** Extra bottom padding for devices with a home indicator (default: 0) */
  safeAreaBottom?: number;
  /** Override the outermost container style */
  style?: StyleProp<ViewStyle>;

  // @deprecated — kept for internal use, use showShadow instead
  showIndicator?: boolean;
}
