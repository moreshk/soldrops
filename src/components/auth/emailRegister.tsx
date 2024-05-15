"use client";

import { registerSchema } from "@/lib/db/schema/auth";
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
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export const EmailRegister = ({
  onOpen,
}: {
  onOpen: (value: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const handleSubmit = async (value: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      ("use server");
      await fetch("/api/auth/register", {
        method: "post",
        body: JSON.stringify({
          email: value.email,
          password: value.password,
          name: value.name,
        }),
      });
      await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirect: false,
        callbackUrl: "/swap",
      });
      onOpen(false);
      toast.success("User registered successfully");
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <p>Create an account to start trading memecoins in minutes!</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={"space-y-4"}
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading || field.disabled}
                    placeholder="tim"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
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
            defaultValue=""
          />
          <FormField
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
            defaultValue=""
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing up...." : "Signup"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
