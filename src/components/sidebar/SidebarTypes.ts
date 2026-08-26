import type { ReactNode } from "react";

export interface SidebarItem {
  label: string;
  icon: string;

  /**
   * React Router navigation
   */
  to?: string;

  /**
   * Match exact route (for NavLink)
   */
  end?: boolean;

  /**
   * Custom active state or active route matching logic
   */
  isActive?: boolean | ((pathname: string) => boolean);

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

  mobileOpen?: boolean;

  onMobileClose?: () => void;

  header: SidebarHeaderConfig;

  sections: SidebarSection[];

  footer?: ReactNode | ((props: { collapsed: boolean; isMobile: boolean }) => ReactNode);

  bottomContent?: ReactNode;

  className?: string;
}