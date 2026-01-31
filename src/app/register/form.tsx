"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SignUpSchema, SignUpValues } from "./validate";
import InputStartIcon from "@/components/ui/input-start-icon";
import InputPasswordContainer from "@/components/ui/input-password";
import { cn } from "@/lib/utils";
import { AtSign, MailIcon, UserIcon, Lock, Heart, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { GenderRadioGroup } from "@/components/ui/gender-radio-group";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: false,
    },
    mode: "onChange",
  });

  function onSubmit(data: SignUpValues) {
    startTransition(async () => {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
        gender: data.gender,
      });

      if (response.error) {
        toast.error("Registration failed", {
          description: response.error.message || "Please check your information and try again.",
        });
      } else {
        toast.success("Welcome to Community Aid! 🎉", {
          description: "Your account has been created successfully.",
        });
        router.push("/");
        router.refresh();
      }
    });
  }

  const getInputClassName = (fieldName: keyof SignUpValues) =>
    cn(
      "h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
      form.formState.errors[fieldName] &&
      "border-red-300 text-red-700 focus:border-red-400 focus:ring-red-100",
    );

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-2">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600">Join the community and start helping today</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="John Doe"
                        className={cn("pl-10", getInputClassName("name"))}
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="your@email.com"
                        className={cn("pl-10", getInputClassName("email"))}
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="johndoe"
                        className={cn("pl-10", getInputClassName("username"))}
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Create a strong password"
                        className={cn("pl-10", getInputClassName("password"))}
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        className={cn("pl-10", getInputClassName("confirmPassword"))}
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3 pt-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Gender</FormLabel>
                  <GenderRadioGroup
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Password Requirements
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Contains uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Includes numbers or special characters
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isPending || !form.formState.isValid}
            className="w-full h-12 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            {isPending ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating Account...
              </>
            ) : (
              <>
                <Heart className="h-5 w-5" />
                Join Community Aid
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          {/* Terms Notice */}
          <p className="text-xs text-center text-gray-600">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </a>
          </p>
        </form>
      </Form>
    </div>
  );
}