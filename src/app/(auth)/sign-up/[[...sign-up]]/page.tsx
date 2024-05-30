"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <SignUp
        appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
      />
    </div>
  );
}
