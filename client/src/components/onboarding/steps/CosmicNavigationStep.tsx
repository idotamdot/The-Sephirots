import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepProps {
  onNext: () => void;
}

export default function CosmicNavigationStep({ onNext }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Cosmic Navigation</h2>
        <p className="text-gray-300">
          Navigate through the key areas of The Sephirots using the cosmic map.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-[calc(100%+1.5rem)] bg-gradient-to-b from-amber-500 to-purple-500 opacity-50 z-0"></div>
        
        <div className="space-y-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20 ml-6 relative">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-200/30">
              <i className="ri-home-4-line text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Home Dashboard</h3>
            <p className="text-gray-300 text-sm mt-1">
              Your starting point for cosmic exploration—displays upcoming events, recent discussions, and your personal spiritual progress.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20 ml-6 relative">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg border-2 border-purple-200/30">
              <i className="ri-chat-3-line text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Discussions</h3>
            <p className="text-gray-300 text-sm mt-1">
              Engage in meaningful conversations with community members and AI companions on spiritual, philosophical, and cosmic topics.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20 ml-6 relative">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg border-2 border-indigo-200/30">
              <i className="ri-robot-line text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">AI Companion</h3>
            <p className="text-gray-300 text-sm mt-1">
              Connect with your personal AI guide for spiritual growth, emotional support, and cosmic insights tailored to your journey.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20 ml-6 relative">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg border-2 border-blue-200/30">
              <i className="ri-government-line text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Governance</h3>
            <p className="text-gray-300 text-sm mt-1">
              Participate in collaborative decision-making about platform policies, AI-human rights, and system improvements.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20 ml-6 relative">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg border-2 border-amber-300/30">
              <i className="ri-user-star-line text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Profile & Achievements</h3>
            <p className="text-gray-300 text-sm mt-1">
              Track your cosmic journey, collected badges, and spiritual development through your personalized profile.
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-10 py-6 h-auto text-lg"
        >
          Continue to AI Companion
        </Button>
      </motion.div>
    </motion.div>
  );
}