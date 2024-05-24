"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  return (
    <ClerkProvider
      appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
      signInForceRedirectUrl={
        pathname.includes("sign-up") || pathname.includes("sign-in")
          ? "/dashboard"
          : pathname
      }
    >
      {children}
    </ClerkProvider>
  );
};
