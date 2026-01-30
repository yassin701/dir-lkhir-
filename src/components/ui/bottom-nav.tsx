"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User, LogOut } from "lucide-react";
import { signOut, useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-card shadow-lg md:hidden">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 px-4 py-3 transition-colors ${
            isActive("/")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Accueil</span>
        </Link>

        {/* Create Need */}
        {session && (
          <Link
            href="/proposer-un-besoin"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-3 transition-colors ${
              isActive("/proposer-un-besoin")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs font-medium">Besoin</span>
          </Link>
        )}

        {/* Dashboard */}
        {session && (
          <Link
            href="/mon-espace"
            className={`flex flex-col items-center justify-center gap-1 px-4 py-3 transition-colors ${
              isActive("/mon-espace")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Espace</span>
          </Link>
        )}

        {/* Logout */}
        {session && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 px-4 py-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-medium">Sortir</span>
          </button>
        )}
      </div>
    </nav>
  );
}
