"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useState } from "react";
import { LoginForm } from "../form/LoginForm";
import { RegisterForm } from "../form/RegisterForm";

type LoginSignupDrawerProps = {
  showOauth: boolean;
};

export const LoginSignupDrawer = ({ showOauth }: LoginSignupDrawerProps) => {
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState<"login" | "register">("register");
  const [open, setOpen] = useState(false);

  const onLoginClick = () => setForm("login");
  const onRegisterClick = () => setForm("register");
  const onClose = () => setOpen(false);

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        Sign up
      </Button>
      <Drawer
        open={open}
        onClose={onClose}
        onOpenChange={setOpen}
        dismissible={!isLoading}
      >
        <DrawerContent>
          <div>
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
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
