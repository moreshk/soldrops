"use client";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Login = () => {
  const { status } = useSession();
  const { push } = useRouter();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (isLoggedIn) push("/swap");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="pt-10">
      {status === "loading" && (
        <div className="w-36 rounded-md animate-pulse h-10 bg-primary/10" />
      )}
      {status === "unauthenticated" && (
        <Button onClick={() => signIn("twitter", { callbackUrl: "/" })}>
          Connect Twitter
        </Button>
      )}
    </div>
  );
};
