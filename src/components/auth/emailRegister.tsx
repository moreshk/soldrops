"use client";

import { loginSchema } from "@/lib/db/schema/auth";
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

export const EmailRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = async (value: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      ("use server");
      await fetch("/api/auth/register", {
        method: "post",
        body: JSON.stringify({
          email: value.email,
          password: value.password,
        }),
      });
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
                    placeholder="tim@apple.com"
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
            {isLoading ? "Logging in...." : "Login In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
