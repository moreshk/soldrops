"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addressShortener } from "@/lib/tokens/utils/addressShortener";
import { Check, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const Settings = () => {
  const { data: session } = useSession();
  const name = session?.user.name;
  const [copied, setCopied] = useState(false);
  const walletAddress = session?.user.walletAddress;
  const username = session?.user.username;
  const email = session?.user.email;

  const copy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  if (session?.user.id)
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-170px)] w-full border border-dashed shadow-sm rounded-lg">
          <div className="flex flex-1 items-center  p-4 lg:p-6">
            <div className="grid gap-6 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Solana Account Address</CardTitle>
                </CardHeader>
                {walletAddress && (
                  <CardContent className="flex gap-4 items-center">
                    <Button
                      onClick={copy}
                      variant="outline"
                      className="p-2 rounded-md border break-all flex-1 justify-start group"
                    >
                      <p className="group-hover:hidden sm:block hidden">
                        {walletAddress}
                      </p>
                      <p className="group-hover:hidden sm:hidden block">
                        {addressShortener(walletAddress)}
                      </p>
                      <p className="hidden group-hover:block">
                        {copied ? "Copied" : "Copy"}
                      </p>
                    </Button>
                    <Button
                      onClick={copy}
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardContent>
                )}
              </Card>
              {username && (
                <Card>
                  <CardHeader>
                    <CardTitle>X Username</CardTitle>
                    <CardDescription>
                      Account is Linked with twitter(X)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-2 rounded-lg border">{username}</div>
                  </CardContent>
                </Card>
              )}
              {email && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-2 rounded-lg border">{email}</div>
                  </CardContent>
                </Card>
              )}
              {name && (
                <Card>
                  <CardHeader>
                    <CardTitle>Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="Store Name" value={name} />
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 justify-end">
                    <Button className="w-full sm:w-28">Update</Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>
    );

  return <></>;
};

export default Settings;
