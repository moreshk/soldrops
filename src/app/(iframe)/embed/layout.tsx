import Link from "next/link";
import Image from "next/image";
import { NovuNotification } from "@/lib/novu/NovuNotification";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { SolBalance } from "@/components/wallet-details/SOLBalance";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { widgetId: string };
}) => {
  return (
    <div className="grid w-full bg-transparent">
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600">
              SolDrops
            </span>
          </div>
          <div className="flex-1"></div>
          <SignedIn>
            <SolBalance />
          </SignedIn>
          <SignedIn>
            <UserButton afterSignOutUrl={`/embed/trade/${params.widgetId}`} />
          </SignedIn>
        </header>
        <div className="flex justify-center items-center">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
