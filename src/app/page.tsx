import { LoginSignupModal } from "@/components/auth/modal/LoginSignupModal";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex gap-2 items-center">
          <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
          <h1 className="relative z-10 text-lg  bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600  text-center font-sans font-bold flex">
            SolDrops
          </h1>
        </Link>
      </header>
      <main className="flex-1 text-center">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Claim the latest and <br />
                  greatest airdrops on Solana
                </h1>
              </div>
              <div className="flex flex-col gap-2">
                <LoginSignupModal showOauth={true} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
