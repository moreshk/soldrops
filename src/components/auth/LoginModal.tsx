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
        <div>
          <Button onClick={() => signIn("twitter", { callbackUrl: path })}>
            Connect Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
