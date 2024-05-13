"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { EmailLogin } from "./emailLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailRegister } from "./emailRegister";

const LoginModal = () => {
  const path = usePathname();
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button className="w-full rounded-2xl" size="lg">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-10">
          <div>
            <Tabs defaultValue="login">
              <TabsList>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <EmailLogin />
              </TabsContent>
              <TabsContent value="signup">
                <EmailRegister />
              </TabsContent>
            </Tabs>
          </div>
          <Button onClick={() => signIn("twitter", { callbackUrl: path })}>
            Connect Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
