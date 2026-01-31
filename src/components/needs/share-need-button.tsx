"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareNeedButtonProps {
  url: string;
}

export default function ShareNeedButton({ url }: ShareNeedButtonProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(url);
    alert("Lien copié dans le presse-papiers !");
  };

  return (
    <Button
      variant="outline"
      className="w-full gap-2"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      Share This Need
    </Button>
  );
}
