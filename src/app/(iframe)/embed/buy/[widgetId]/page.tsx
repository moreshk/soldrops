import { AuthButton } from "@/components/auth/AuthButton";
import { BuySOL } from "@/components/buy/BuySOL";
import { server } from "@/trpc/server/api";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const Page = async ({ params }: { params: { widgetId?: string } }) => {
  const { widget } = await server.widgets.getWidgetById.query({
    id: params.widgetId ?? "",
  });

  if (widget?.id) {
    return (
      <>
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
      </>
    );
  }

  return <>Page not found</>;
};

export default Page;
