import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import DoveAndStars from "@/components/icons/DoveAndStars";
import FounderBadge from "@/components/badges/FounderBadge";
import { CosmicEmojiBar } from "@/components/cosmic/CosmicEmojiBar";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-amber-800 mb-6">404 | Page Not Found</h1>
      
      <div className="bg-white bg-opacity-60 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-lg max-w-2xl">
        <p className="text-xl text-amber-700 mb-6">
          The Sephirot you're looking for doesn't seem to exist in this dimension.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
          <DoveAndStars
            size="xl"
            fillColor="#9333ea"
            showStars={true}
            withGlow={true}
            glowColor="rgba(168, 85, 247, 0.5)"
            className="mb-4 md:mb-0"
          />
          
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-medium text-amber-800">Return to the Tree of Life</h2>
            <p className="text-amber-600">
              Continue your journey through the divine emanations
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="default" className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white">
              Return Home
            </Button>
          </Link>
          <Link href="/discussions">
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              Browse Discussions
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Showcase of Founder Badge Variations */}
      <div className="mt-12 bg-white bg-opacity-40 backdrop-blur-sm rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-medium text-amber-800 mb-4">Founder Badge Variations</h3>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="text-center">
            <FounderBadge size="lg" />
            <p className="mt-2 text-amber-700 text-sm">Standard</p>
          </div>
          
          <div className="text-center">
            <FounderBadge size="lg" enhanced={true} />
            <p className="mt-2 text-amber-700 text-sm">Enhanced</p>
          </div>
          
          <div className="text-center">
            <FounderBadge size="lg" enhanced={true} isAscended={true} />
            <p className="mt-2 text-amber-700 text-sm">Ascended</p>
          </div>
        </div>
      </div>
      
      {/* Cosmic Emoji Reaction System Test */}
      <div className="mt-12 bg-white bg-opacity-40 backdrop-blur-sm rounded-xl p-6 shadow-md max-w-xl">
        <h3 className="text-xl font-medium text-amber-800 mb-4">Cosmic Emoji Reaction System</h3>
        <p className="text-amber-700 mb-6">
          Express your cosmic resonance with these mystical emojis. Each reaction channels different energy from the Sephirotic Tree.
        </p>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Test Content</h4>
          <p className="text-purple-700 dark:text-purple-200 mb-4">
            This is a sample content piece to test the cosmic emoji reaction system. React with the emojis below to express your resonance with this mystical message.
          </p>
          
          {/* The CosmicEmojiBar component will be displayed here */}
          <CosmicEmojiBar 
            contentId={999} 
            contentType="discussion" 
            size="md" 
          />
        </div>
      </div>
    </div>
  );
}