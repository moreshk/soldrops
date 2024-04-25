"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AlignRight } from "lucide-react";
import { defaultLinks } from "@/config/nav";
import { NovuNotification } from "@/lib/novu/NovuNotification";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <div className="md:hidden border-b mb-4 pb-2 w-full">
        <nav className="flex justify-between w-full items-center">
          <div className="flex gap-1 items-center">
            <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
            <h1 className="relative z-10 text-lg  bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600  text-center font-sans font-bold flex">
              SolDrops
            </h1>
          </div>
          <div className="flex justify-center items-center gap-2">
            <NovuNotification />
            <Button variant="ghost" onClick={() => setOpen(!open)}>
              <AlignRight />
            </Button>
          </div>
        </nav>
        {open ? (
          <div className="my-4 p-4 bg-muted">
            <ul className="space-y-2">
              {defaultLinks.map((link) => (
                <li
                  key={link.title}
                  onClick={() => setOpen(false)}
                  className=""
                >
                  <Link
                    href={link.href}
                    className={
                      pathname === link.href
                        ? "text-primary hover:text-primary font-semibold"
                        : "text-muted-foreground hover:text-primary"
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="absolute right-24 top-10 sm:block hidden">
        <NovuNotification />
      </div>
    </div>
  );
}
