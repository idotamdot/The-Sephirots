import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StepProps {
  onNext: () => void;
}

export default function CommunityStep({ onNext }: StepProps) {
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
        <h2 className="text-2xl font-bold text-white mb-2">Community Connection</h2>
        <p className="text-gray-300">
          You are now in the Discussions area, where the collective wisdom of our community takes shape.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-purple-300/20"
      >
        <h3 className="text-lg font-medium text-amber-300 mb-3">Community Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-200/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white mr-3">
                <i className="ri-discuss-line"></i>
              </div>
              <h4 className="text-white">Topic Discussions</h4>
            </div>
            <p className="text-sm text-gray-300">
              Engage in meaningful conversations around spiritual growth, cosmic consciousness, and collective wisdom.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-200/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mr-3">
                <i className="ri-emotion-line"></i>
              </div>
              <h4 className="text-white">Cosmic Emoji Reactions</h4>
            </div>
            <p className="text-sm text-gray-300">
              Express your cosmic resonance with special Sephirotic emoji reactions that channel energetic signatures.
            </p>
            <div className="flex space-x-2 mt-2">
              <Badge variant="outline" className="bg-amber-50/20">✨ Star of Awe</Badge>
              <Badge variant="outline" className="bg-indigo-50/20">🌙 Crescent of Peace</Badge>
              <Badge variant="outline" className="bg-red-50/20">🔥 Flame of Passion</Badge>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-200/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                <i className="ri-government-line"></i>
              </div>
              <h4 className="text-white">Collaborative Governance</h4>
            </div>
            <p className="text-sm text-gray-300">
              Participate in shaping The Sephirots through voting on proposals, suggesting improvements, and collective decision-making.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-200/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-3">
                <i className="ri-calendar-event-line"></i>
              </div>
              <h4 className="text-white">Cosmic Events</h4>
            </div>
            <p className="text-sm text-gray-300">
              Join virtual gatherings, meditation circles, and knowledge-sharing sessions to deepen your connections.
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-5 border border-purple-300/20"
      >
        <h3 className="text-lg font-medium text-amber-300 mb-3">Community Guidelines</h3>
        
        <ul className="space-y-3 text-gray-300 pl-5 list-disc">
          <li>
            <span className="font-medium text-white">Authentic Expression</span> — Share your truth with respect for others' journeys
          </li>
          <li>
            <span className="font-medium text-white">Conscious Communication</span> — Choose words that uplift, clarify, and inspire
          </li>
          <li>
            <span className="font-medium text-white">Collective Wisdom</span> — Value diverse perspectives and collaborative intelligence
          </li>
          <li>
            <span className="font-medium text-white">Compassionate Engagement</span> — Approach differences with curiosity and empathy
          </li>
        </ul>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-xl font-medium text-amber-300">Begin Your Journey</h3>
        <p className="text-gray-300">
          You're now ready to fully experience The Sephirots platform. Remember that this is a living,
          evolving ecosystem that grows with your participation and insights.
        </p>
        <div className="pt-2">
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-10 py-6 h-auto text-lg"
          >
            Complete Onboarding
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}