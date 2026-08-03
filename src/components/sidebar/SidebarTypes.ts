import type { ReactNode } from "react";

export interface SidebarItem {
  label: string;
  icon: string;

  /**
   * React Router navigation
   */
  to?: string;

  /**
   * Button action
   */
  onClick?: () => void;

  badge?: string | number;

  disabled?: boolean;
}

export interface SidebarSection {
  title?: string;
  items?: SidebarItem[];

  /**
   * For custom sections
   * Example: boards list, workspace switcher
   */
  render?: () => ReactNode;
}

export interface SidebarHeaderConfig {
  logo: ReactNode;
  title?: string;
}

export interface SidebarProps {
  collapsed: boolean;

  onToggle: () => void;

  header: SidebarHeaderConfig;

  sections: SidebarSection[];

  footer?: ReactNode;

  bottomContent?: ReactNode;
}