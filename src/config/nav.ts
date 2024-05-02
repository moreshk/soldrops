import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/whitelist",
        title: "Whitelist",
        icon: Globe,
      },
      {
        href: "/campaign",
        title: "Campaign",
        icon: Globe,
      },
      {
        href: "/join-campaign",
        title: "Join Campaign",
        icon: Globe,
      },
    ],
  },

];

