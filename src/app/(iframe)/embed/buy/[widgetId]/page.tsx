import { AuthButton } from "@/components/auth/AuthButton";
import { BuySolWidget } from "@/components/buy/BuySolWidget";
import { BuySuccess } from "@/components/buy/BuySuccess";
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
          <BuySolWidget widget={widget} />
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
