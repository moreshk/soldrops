import { checkAuth } from "@/lib/auth/utils";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SideBar } from "@/components/layout/Sidebar";
import Image from "next/image";
import { SidebarSheet } from "@/components/layout/SidebarSheet";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";
import { NovuNotification } from "@/lib/novu/NovuNotification";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await checkAuth();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                width={40}
                height={40}
                src="/favicon-32x32.png"
                alt="logo"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600">
                SolDrops
              </span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <SideBar />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <SidebarSheet />
          <div className="flex-1"></div>
          <NovuNotification />
          <UserProfileMenu />
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
