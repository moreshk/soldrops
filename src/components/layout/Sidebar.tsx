"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLinks, layoutDefaultLinks } from "./layout-utils";
import { useSession } from "next-auth/react";

export const SideBar = () => {
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];
  const { data: session } = useSession();
  return (
    <div className="flex-1">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {layoutDefaultLinks.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === link.href
                ? "text-primary bg-muted"
                : "text-muted-foreground"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.title}
          </Link>
        ))}
        {session?.user.isAdmin && (
          <div>
            <p className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary">
              Admin
            </p>
            {adminLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === link.href
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};
