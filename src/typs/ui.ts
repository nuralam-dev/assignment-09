import type { ComponentProps } from "react";
import type { TooltipContent } from "@/components/ui/tooltip";

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export type SidebarProviderOptions = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SidebarOptions = {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

export type SidebarMenuButtonOptions = {
  isActive?: boolean;
  tooltip?: string | ComponentProps<typeof TooltipContent>;
};

export type SidebarMenuActionOptions = {
  showOnHover?: boolean;
};

export type SidebarMenuSkeletonOptions = {
  showIcon?: boolean;
};

export type SidebarMenuSubButtonOptions = {
  size?: "sm" | "md";
  isActive?: boolean;
};

export type CardOptions = {
  size?: "default" | "sm";
};

export type SheetContentOptions = {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
};

export type ToastIconProps = {
  type: string | undefined;
};
