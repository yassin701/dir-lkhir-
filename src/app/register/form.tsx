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
        toast.error("L'inscription a échoué", {
          description: response.error.message || "Veuillez vérifier vos informations et réessayer.",
        });
      } else {
        toast.success("Bienvenue sur Dir-Khir! 🎉", {
          description: "Votre compte a été créé avec succès.",
        });
        router.push("/");
        router.refresh();
      }
    });
  }

  const getInputClassName = (fieldName: keyof SignUpValues) =>
    cn(
      "h-11 bg-white border-emerald-300 focus:border-emerald-700 focus:ring-emerald-700/20",
      form.formState.errors[fieldName] &&
      "border-red-300 text-red-700 focus:border-red-400 focus:ring-red-100",
    );

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-emerald-700 to-amber-600 mb-2">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-900">Créer un Compte</h2>
        <p className="text-emerald-700">Rejoignez la communauté et commencez à aider aujourd'hui</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4 bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-emerald-900">Nom Complet</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                      <Input
                        placeholder="Jean Dupont"
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
                  <FormLabel className="text-sm font-medium text-emerald-900">Adresse E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                      <Input
                        placeholder="votre@email.com"
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
                  <FormLabel className="text-sm font-medium text-emerald-900">Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                      <Input
                        placeholder="jeandupont"
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
                  <FormLabel className="text-sm font-medium text-emerald-900">Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                      <Input
                        type="password"
                        placeholder="Créez un mot de passe fort"
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
                  <FormLabel className="text-sm font-medium text-emerald-900">Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                      <Input
                        type="password"
                        placeholder="Confirmez votre mot de passe"
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
                  <FormLabel className="text-sm font-medium text-emerald-900">Genre</FormLabel>
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-emerald-800 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Exigences du mot de passe
            </p>
            <ul className="text-xs text-emerald-700 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Au moins 8 caractères de long
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Contient des lettres majuscules et minuscules
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Inclut des chiffres ou des caractères spéciaux
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isPending || !form.formState.isValid}
            className="w-full h-12 gap-2 bg-gradient-to-r from-emerald-700 to-amber-600 hover:from-emerald-800 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
          >
            {isPending ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Création du compte...
              </>
            ) : (
              <>
                <Heart className="h-5 w-5" />
                Rejoindre Dir-Khir
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          {/* Terms Notice */}
          <p className="text-xs text-center text-emerald-700">
            En créant un compte, vous acceptez nos{" "}
            <a href="/terms" className="text-emerald-700 hover:text-emerald-900 font-medium">
              Conditions de service
            </a>{" "}
            et notre{" "}
            <a href="/privacy" className="text-emerald-700 hover:text-emerald-900 font-medium">
              Politique de confidentialité
            </a>
          </p>
        </form>
      </Form>
    </div>
  );
}