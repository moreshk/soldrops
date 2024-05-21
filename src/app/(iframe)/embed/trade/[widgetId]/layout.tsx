import Link from "next/link";
import { SideBar } from "@/components/layout/Sidebar";
import Image from "next/image";
import { SidebarSheet } from "@/components/layout/SidebarSheet";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";
import { NovuNotification } from "@/lib/novu/NovuNotification";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen w-full bg-transparent">
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600">
              SolDrops
            </span>
          </Link>
          <div className="flex-1"></div>
          <NovuNotification />
          <UserProfileMenu />
        </header>
        <div className="h-[calc(100vh-200px)] flex justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
