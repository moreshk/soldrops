import { server } from "@/trpc/server/api";
import { WhiteListedList } from "./component/WhiteListedList";
import { SignedIn } from "@clerk/nextjs";

export default async function Whitelist() {
  const { whitelist } = await server.whitelist.getWhitelist.query();

  return (
    <SignedIn>
      <main>
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Whitelist</h1>
        </div>
        <WhiteListedList list={whitelist} />
      </main>
    </SignedIn>
  );
}
