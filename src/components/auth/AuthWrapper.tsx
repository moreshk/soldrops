"use client";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { AuthLoginSignup } from "./AuthLoginSignup";

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  if (status === "authenticated") return <>{children}</>;
  if (status === "unauthenticated")
    return (
      <div>
        <AuthLoginSignup />
      </div>
    );
  return <></>;
};
