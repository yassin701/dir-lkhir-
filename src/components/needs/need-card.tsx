"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Phone, Calendar, User, Heart } from "lucide-react";
import { Need } from "@/db/schema";
import { volunteerForNeed, unvolunteerForNeed } from "@/lib/actions/needs";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface NeedCardProps {
  need: Need & {
    author: any;
    volunteers: any[];
  };
  session: any;
}

export default function NeedCard({ need, session }: NeedCardProps) {
  const [isPending, startTransition] = useTransition();
  const hasVolunteered = session?.user?.id
    ? need.volunteers.some((v) => v.userId === session.user.id)
    : false;

  const handleVolunteer = () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    startTransition(async () => {
      const result = hasVolunteered
        ? await unvolunteerForNeed(need.id)
        : await volunteerForNeed(need.id);

      if (result.success) {
        toast.success(
          hasVolunteered ? "Your commitment has been removed" : "Thank you for your help!"
        );
      } else {
        toast.error(result.error || "An error occurred");
      }
    });
  };

  const categoryEmojis: Record<string, string> = {
    education: "📚",
    cleaning: "🧹",
    financial: "💰",
    health: "❤️",
    food: "🍴",
    other: "🤝",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-200 hover:border-blue-300">
      <Link href={`/needs/${need.id}`}>
        <CardHeader className="pb-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-colors p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {need.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{need.author?.name}</span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-0 font-medium px-3 py-1">
                <span className="mr-1">{categoryEmojis[need.category] || "🤝"}</span>
                {need.category.charAt(0).toUpperCase() + need.category.slice(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{need.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Recently</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="space-y-5 p-6 pt-0">
        <p className="line-clamp-3 text-gray-700 leading-relaxed">
          {need.description}
        </p>

        {/* WhatsApp Contact */}
        {need.phoneWhatsApp && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">WhatsApp Contact</p>
                  <p className="text-xs text-gray-600">Click to send a message</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${need.phoneWhatsApp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Phone className="h-4 w-4" />
                Message
              </a>
            </div>
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <span className="font-bold text-gray-900">{need.volunteers?.length || 0}</span>
                <span className="text-gray-600 ml-1">
                  {need.volunteers?.length === 1 ? "person helping" : "people helping"}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleVolunteer}
            disabled={isPending}
            variant={hasVolunteered ? "outline" : "default"}
            className={`gap-2 ${hasVolunteered 
              ? "border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800" 
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Loading...
              </>
            ) : hasVolunteered ? (
              <>
                <Heart className="h-4 w-4 fill-current" />
                Remove Help
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                I Can Help
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}