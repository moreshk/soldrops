"use client";
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
import { registerSchema } from "@/lib/db/schema/auth";
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

type RegisterFormProps = {
  showOath?: boolean;
  onLoginClick: () => void;
  onClose: () => void;
  isLoading: boolean;
  onChangeLoading: (value: boolean) => void;
};

export const RegisterForm = ({
  onLoginClick,
  showOath,
  isLoading,
  onChangeLoading,
  onClose,
}: RegisterFormProps) => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });
  const pathname = usePathname();

  const handleSubmit = async (value: z.infer<typeof registerSchema>) => {
    onChangeLoading(true);
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
        callbackUrl: pathname,
      });
      toast.success("Registered successfully");
      onChangeLoading(false);
      onClose();
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
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account to start trading
              memecoins in minutes!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading || field.disabled}
                          placeholder="Tim took"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
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
              </div>
              <div className="grid gap-2">
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
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating account..." : "Create an account"}
              </Button>
              {showOath && (
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => signIn("twitter", { callbackUrl: pathname })}
                >
                  Continue with twitter
                </Button>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="underline"
              >
                Sign in
              </button>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};
