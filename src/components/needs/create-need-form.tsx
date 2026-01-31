"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNeed } from "@/lib/actions/needs";
import { toast } from "sonner";
import { MapPin, Tag, Phone, Loader2, FileText } from "lucide-react";

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
  "Oujda",
  "Kenitra",
  "Safi",
  "El Jadida",
  "Nador",
];

const categories = [
  { value: "education", label: "📚 Education & Tutoring" },
  { value: "cleaning", label: "🧹 Cleaning & Maintenance" },
  { value: "financial", label: "💰 Financial Assistance" },
  { value: "health", label: "🏥 Health & Medical" },
  { value: "food", label: "🍴 Food & Groceries" },
  { value: "transportation", label: "🚗 Transportation" },
  { value: "petcare", label: "🐾 Pet Care" },
  { value: "technology", label: "💻 Tech Support" },
  { value: "other", label: "🤝 Other Assistance" },
];

const createNeedSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.string().min(1, "Please select a category"),
  city: z.string().min(1, "Please select a city"),
  phoneWhatsApp: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: "Please enter a valid phone number",
    }),
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
      category: "",
      city: "",
      phoneWhatsApp: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: CreateNeedFormValues) {
    setIsLoading(true);
    try {
      const result = await createNeed(data);

      if (result.success) {
        toast.success("🎉 Need published successfully!", {
          description: "Your request is now visible to volunteers.",
        });
        form.reset();
        // Redirect to dashboard after successful creation
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Unable to publish need", {
          description: result.error || "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please check your connection and try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Create a New Need</h1>
        <p className="text-gray-600">
          Share what you need help with. Be specific so volunteers can assist you better.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl border shadow-sm">
          <div className="space-y-6">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Need Title *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="e.g., Help with moving furniture this Saturday"
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Keep it clear and specific
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Section */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Detailed Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you need help with, when you need it, and any specific requirements..."
                      className="min-h-[180px] resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormDescription className="text-xs">
                      Include details like time, location, and required skills
                    </FormDescription>
                    <span className={`text-xs ${field.value.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                      {field.value.length}/500
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-green-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Location *</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange} 
                        disabled={isLoading}
                      >
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                          </div>
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
                      <FormLabel className="text-gray-700 font-medium">Category *</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange} 
                        disabled={isLoading}
                      >
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </div>
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
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-purple-600 rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              </div>

              <FormField
                control={form.control}
                name="phoneWhatsApp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">WhatsApp Number (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="+212 612-345-678"
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Volunteers will use this to contact you. Include country code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <Button 
              type="submit" 
              disabled={isLoading || !form.formState.isValid} 
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Need"
              )}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-3">
              By publishing, you agree to our terms of service. Your need will be visible to volunteers in your area.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}