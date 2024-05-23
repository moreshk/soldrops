"use client";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";

export const AuthButton = () => (
  <SignedOut>
    <div className="w-full">
      <SignInButton mode="modal">
        <Button size="lg" className="w-full rounded-2xl">
          Sign up
        </Button>
      </SignInButton>
    </div>
  </SignedOut>
);
