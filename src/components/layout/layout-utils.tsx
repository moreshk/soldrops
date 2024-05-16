import {
  ArrowRightLeft,
  CircleDollarSign,
  Coins,
  Droplet,
  Home,
  LayoutTemplate,
  LucideIcon,
  ScrollText,
  Send,
} from "lucide-react";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  visibility: boolean;
}

export const layoutDefaultLinks: SidebarLink[] = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: Home,
    visibility: true,
  },
  { href: "/drops", title: "Drops", icon: Droplet, visibility: true },
  { href: "/swap", title: "Swap", icon: ArrowRightLeft, visibility: true },
  {
    href: "/buy",
    title: "Buy",
    icon: CircleDollarSign,
    visibility: true,
  },
  {
    href: "/transaction",
    title: "Transaction",
    icon: ScrollText,
    visibility: true,
  },
  { href: "/send", title: "Send", icon: Send, visibility: true },
];

export const adminLinks = [
  {
    href: "/tokens",
    title: "Tokens",
    icon: Coins,
    visibility: true,
  },
  {
    href: "/widgets",
    title: "Widgets",
    icon: LayoutTemplate,
    visibility: true,
  },
];
