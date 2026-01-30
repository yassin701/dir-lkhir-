"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNeed } from "@/lib/actions/needs";
import { toast } from "sonner";

const moroccanCities = [
  "Tangier",
  "Tetouan",
  "Fez",
  "Meknes",
  "Rabat",
  "Casablanca",
  "Marrakech",
  "Agadir",
  "Essaouira",
  "Laayoune",
];

const categories = [
  { value: "education", label: "📚 Education" },
  { value: "cleaning", label: "🧹 Nettoyage" },
  { value: "financial", label: "💰 Aide financière" },
  { value: "health", label: "❤️ Santé" },
  { value: "food", label: "🍴 Nourriture" },
  { value: "other", label: "🤝 Autre" },
];

const createNeedSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  category: z.string(),
  city: z.string(),
  phoneWhatsApp: z.string().optional(),
});

type CreateNeedFormValues = z.infer<typeof createNeedSchema>;

export default function CreateNeedForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateNeedFormValues>({
    resolver: zodResolver(createNeedSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      city: "Casablanca",
      phoneWhatsApp: "",
    },
  });

  async function onSubmit(data: CreateNeedFormValues) {
    setIsLoading(true);
    try {
      const result = await createNeed(data);

      if (result.success) {
        toast.success("Besoin publié avec succès!");
        form.reset();
        // Only push to homepage - refresh happens automatically
        router.push("/");
      } else {
        toast.error(result.error || "Une erreur est survenue");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du besoin</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Aide pour déménagement" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez en détail ce dont vous avez besoin..."
                  className="min-h-[150px]"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moroccanCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneWhatsApp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro WhatsApp (optionnel)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: +212612345678"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Sera utilisé pour créer un lien WhatsApp direct
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Publication en cours..." : "Publier le besoin"}
        </Button>
      </form>
    </Form>
  );
}
