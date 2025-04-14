import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function SupportButton() {
  return (
    <Link href="/support">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-200 hover:border-amber-300 transition-all duration-300"
      >
        <Sparkles className="w-4 h-4 mr-2 text-amber-600" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-amber-500 font-medium">
          Support Our Journey
        </span>
      </Button>
    </Link>
  );
}