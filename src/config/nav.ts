import { SidebarLink } from "@/components/layout/layout-utils";
import { ArrowRightLeft, Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/swap", title: "Swap", icon: ArrowRightLeft, visibility: true },
  { href: "/dashboard", title: "Home", icon: HomeIcon, visibility: true },
  { href: "/account", title: "Account", icon: Cog, visibility: true },
  { href: "/settings", title: "Settings", icon: Cog, visibility: true },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/widgets",
        title: "Widgets",
        icon: Globe,
        visibility: true,
      },
      {
        href: "/tokens",
        title: "Tokens",
        icon: Globe,
        visibility: false,
      },
      {
        href: "/whitelist",
        title: "Whitelist",
        icon: Globe,
        visibility: false,
      },
      {
        href: "/campaign",
        title: "Campaign",
        icon: Globe,
        visibility: false,
      },
      {
        href: "/join-campaign",
        title: "Join Campaign",
        icon: Globe,
        visibility: false,
      },
    ],
  },
];
