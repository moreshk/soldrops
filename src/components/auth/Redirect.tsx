"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Redirect = () => {
  const { data: session } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (session) {
      push("/swap");
    }
  }, [session]);
  return <></>;
};
