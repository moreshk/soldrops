"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { LoginForm } from "../form/LoginForm";
import { RegisterForm } from "../form/RegisterForm";
import { Button } from "@/components/ui/button";

type LoginSignupModalProps = {
  showOauth?: boolean;
};

export const LoginSignupModal = ({ showOauth }: LoginSignupModalProps) => {
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState<"login" | "register">("register");
  const [open, setOpen] = useState(false);

  const onLoginClick = () => setForm("login");
  const onRegisterClick = () => setForm("register");

  return (
    <>
      <Button
        className="w-full rounded-2xl"
        size="lg"
        onClick={() => setOpen(true)}
      >
        Sign up
      </Button>
      <Dialog open={open} onOpenChange={!isLoading ? setOpen : undefined}>
        <DialogContent className="max-w-md p-0">
          {form === "login" && (
            <LoginForm
              onChangeLoading={setLoading}
              isLoading={isLoading}
              onRegisterClick={onRegisterClick}
              showOath={showOauth}
            />
          )}
          {form === "register" && (
            <RegisterForm
              onLoginClick={onLoginClick}
              showOath={showOauth}
              onChangeLoading={setLoading}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
