import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";
import { WhiteListedList } from "./component/WhiteListedList";

export default async function Whitelist() {
  await checkAuth();
  const { whitelist } = await api.whitelist.getWhitelist.query();

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Whitelist</h1>
      </div>
      <WhiteListedList list={whitelist} />
    </main>
  );
}
