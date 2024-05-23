"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { layoutDefaultLinks } from "./layout-utils";
import { usePathname } from "next/navigation";

export const SidebarSheet = () => {
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600">
              SolDrops
            </span>
          </Link>
          {layoutDefaultLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                pathname === link.href
                  ? "text-primary bg-muted"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
