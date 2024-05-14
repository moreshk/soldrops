"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { EmailLogin } from "./emailLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailRegister } from "./emailRegister";
import { useState } from "react";
import { signIn } from "next-auth/react";

const LoginModal = () => {
  const [tab, setTab] = useState("login");
  const [open, setOpen] = useState<boolean>(false);
  const path = usePathname();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl"
        size="lg"
      >
        Login
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Soldrop</DialogTitle>
          </DialogHeader>
          <div className="space-y-10">
            <div>
              <Tabs defaultValue="login" value={tab}>
                <TabsList>
                  <TabsTrigger value="login" onClick={() => setTab("login")}>
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" onClick={() => setTab("signup")}>
                    Sign up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <EmailLogin onOpen={setOpen} />
                </TabsContent>
                <TabsContent value="signup">
                  <EmailRegister onOpen={setOpen} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex gap-2 flex-col">
              {tab == "login" && (
                <Button onClick={() => setTab("signup")}>
                  Create new account
                </Button>
              )}
              {tab === "signup" && (
                <Button onClick={() => setTab("login")}>
                  Login with existing account
                </Button>
              )}
              <Button onClick={() => signIn("twitter", { callbackUrl: path })}>
                Connect Twitter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;
