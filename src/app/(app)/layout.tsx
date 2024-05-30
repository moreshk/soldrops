import Navbar from "@/components/Navbar";
import { SignedIn } from "@clerk/nextjs";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignedIn>
      <main>
        <div className="flex h-screen">
          <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
            <Navbar />
            {children}
          </main>
        </div>
      </main>
    </SignedIn>
  );
}
