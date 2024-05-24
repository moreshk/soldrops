import Link from "next/link";

import SidebarItems from "./SidebarItems";

import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Sidebar = async () => (
  <SignedIn>
    <aside className="h-screen min-w-52 bg-muted hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex gap-1 items-center">
            <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
            <h1 className="relative z-10 text-lg  bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600  text-center font-sans font-bold flex">
              SolDrops
            </h1>
          </div>
          <SidebarItems />
        </div>
        <UserButton />
      </div>
    </aside>
  </SignedIn>
);

export default Sidebar;
