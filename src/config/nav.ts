import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon, visibility: true },
  { href: "/account", title: "Account", icon: Cog, visibility: true },
  { href: "/settings", title: "Settings", icon: Cog, visibility: true },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
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
