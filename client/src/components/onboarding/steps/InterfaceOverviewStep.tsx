import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepProps {
  onNext: () => void;
}

export default function InterfaceOverviewStep({ onNext }: StepProps) {
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
        <h2 className="text-2xl font-bold text-white mb-2">Interface Overview</h2>
        <p className="text-gray-300">
          The Sephirots interface is designed for intuitive navigation through the cosmic wisdom landscape.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mr-3">
              <i className="ri-layout-4-line text-white"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Cosmic Layout</h3>
          </div>
          <p className="text-gray-300 text-sm">
            The main dashboard presents your path through the Tree of Life with intuitive navigation and personalized insights.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mr-3">
              <i className="ri-navigation-line text-white"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Sidebar Navigation</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Access all core areas including discussions, governance, and your AI companion through the intuitive sidebar menu.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
              <i className="ri-user-settings-line text-white"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Profile & Settings</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Manage your cosmic profile, spiritual preferences, and notification settings through your profile menu.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mr-3">
              <i className="ri-notification-3-line text-white"></i>
            </div>
            <h3 className="text-lg font-medium text-amber-300">Cosmic Notifications</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Stay connected to community activity, spiritual insights, and important events through the notification system.
          </p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-300/20"
      >
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mr-3 text-indigo-900">
            <i className="ri-lightbulb-flash-line"></i>
          </div>
          <h3 className="text-lg font-medium text-amber-300">Cosmic Insight</h3>
        </div>
        <p className="text-gray-300 text-sm">
          The interface adapts to your energy and spiritual journey, revealing new features and deeper wisdom as you progress through the cosmic levels.
        </p>
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
          Continue Journey
        </Button>
      </motion.div>
    </motion.div>
  );
}