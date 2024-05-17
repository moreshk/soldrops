"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/db/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

type LoginFormProps = {
  showOath?: boolean;
  onRegisterClick: () => void;
  isLoading: boolean;
  onChangeLoading: (value: boolean) => void;
};

export const LoginForm = ({
  onRegisterClick,
  showOath,
  isLoading,
  onChangeLoading,
}: LoginFormProps) => {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = async (value: z.infer<typeof loginSchema>) => {
    onChangeLoading(true);
    try {
      await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirect: false,
        callbackUrl: pathname,
      });
      toast.success("Login successfully");
      onChangeLoading(false);
    } catch (e) {
      toast.error("Oops something went wrong");
      onChangeLoading(false);
    }
  };

  return (
    <Card className="w-full border-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
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
              </div>
              <div className="grid gap-2">
                <FormField
                  defaultValue=""
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
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
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              {showOath && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn("twitter", { callbackUrl: pathname })}
                >
                  Continue with Twitter
                </Button>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onRegisterClick}
                className="underline"
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};
