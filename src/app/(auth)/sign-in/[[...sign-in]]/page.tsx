"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <SignIn
        appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
      />
    </div>
  );
}
