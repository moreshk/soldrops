"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/lib/db/schema/auth";
import { toast } from "sonner";

export const EmailLogin = ({
  onOpen,
}: {
  onOpen: (value: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = async (value: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirect: false,
        callbackUrl: "/swap",
      });
      toast.success("Login successfully");
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <p>Login with existing account</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={"space-y-4"}
        >
          <FormField
            control={form.control}
            name="email"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading || field.disabled}
                    placeholder="tim@apple.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            defaultValue=""
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    {...field}
                    disabled={isLoading || field.disabled}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in...." : "Login In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
