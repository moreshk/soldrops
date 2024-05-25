import { AuthButton } from "@/components/auth/AuthButton";
import { BuySOL } from "@/components/buy/BuySOL";
import { buttonVariants } from "@/components/ui/button";
import { server } from "@/trpc/server/api";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Page = async ({ params }: { params: { widgetId?: string } }) => {
  const { widget } = await server.widgets.getWidgetById.query({
    id: params.widgetId ?? "",
  });

  if (widget?.id) {
    return (
      <>
        <div className="h-[calc(100vh-120px)] flex justify-center items-center flex-col w-full">
          <div className="flex justify-between w-full max-w-md mb-3 items-center">
            {widget?.website ? (
              <a
                href={widget?.website}
                className={`flex gap-2 items-center ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                <ArrowLeft />
                <p className="font-bold">Go Back</p>
              </a>
            ) : (
              <Link
                href={`/embed/trade/${widget.id}`}
                className={`flex gap-2 items-center ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                <ArrowLeft />
                <p className="font-bold">Go Back</p>
              </Link>
            )}
            <div />
          </div>
          <SignedIn>
            <BuySOL
              failureRedirectUrl={`${process.env.NEXT_PUBLIC_URL!}/embed/buy/${
                widget.id
              }?tokenTransfer=error`}
              successRedirectUrl={`${process.env.NEXT_PUBLIC_URL!}/embed/buy/${
                widget.id
              }?tokenTransfer=success`}
            />
          </SignedIn>
          <SignedOut>
            <AuthButton fallbackUrl={`/embed/buy/${widget.id}`} />
          </SignedOut>
        </div>
      </>
    );
  }

  return <>Page not found</>;
};

export default Page;
