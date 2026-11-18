import type { ReactNode } from "react";

export type ChildrenProps = {
  children: ReactNode;
};

export type AccountMenuProps = {
  user: { name: string; email: string };
  onNavigate?: () => void;
};
