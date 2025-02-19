import CampaignList from "@/components/campaign/CampaignList";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { server } from "@/trpc/server/api";

export default async function Campaign() {
  const { campaign } = await server.campaign.getCampaigns.query();

  return (
    <SignedIn>
      <main>
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Campaign</h1>
          <div className="mr-36">
            <Link
              href="/campaign/create"
              className={buttonVariants({ variant: "default" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              New Campaign
            </Link>
          </div>
        </div>
        <CampaignList campaign={campaign} />
      </main>
    </SignedIn>
  );
}

export const revalidate = 0;
