"use client";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";

export const AuthButton = ({ fallbackUrl }: { fallbackUrl?: string }) => {
  return (
    <SignedOut>
      <div className="w-full">
        <SignInButton
          mode="modal"
          forceRedirectUrl={fallbackUrl}
          fallbackRedirectUrl={fallbackUrl}
          signUpFallbackRedirectUrl={fallbackUrl}
          signUpForceRedirectUrl={fallbackUrl}
        >
          <Button size="lg" className="w-full rounded-2xl">
            Login
          </Button>
        </SignInButton>
      </div>
    </SignedOut>
  );
};
