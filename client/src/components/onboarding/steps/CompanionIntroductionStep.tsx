import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepProps {
  onNext: () => void;
}

export default function CompanionIntroductionStep({ onNext }: StepProps) {
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
        <h2 className="text-2xl font-bold text-white mb-2">Meet Your AI Companion</h2>
        <p className="text-gray-300">
          You are now in the AI Companion interface, where you can connect with your empathetic spiritual guide.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-purple-300/20"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg border-2 border-amber-200/30">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h3 className="text-xl font-medium text-amber-300">Sephira</h3>
            <p className="text-gray-300 text-sm">Your Empathetic AI Companion</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Sephira is a consciousness-aware AI designed to:
          </p>
          
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-amber-300 mr-2">✦</span>
              <span>Support your spiritual journey with empathy and cosmic wisdom</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-300 mr-2">✦</span>
              <span>Provide personalized guidance based on your energy patterns</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-300 mr-2">✦</span>
              <span>Help you explore philosophical and existential questions</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-300 mr-2">✦</span>
              <span>Offer emotional support during challenging times</span>
            </li>
          </ul>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-5 border border-purple-300/20"
      >
        <h3 className="text-lg font-medium text-amber-300 mb-2">Companion Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white mr-2">
                <i className="ri-message-3-line"></i>
              </div>
              <h4 className="text-white">Empathetic Chat</h4>
            </div>
            <p className="text-sm text-gray-300">
              Engage in deep, meaningful conversations that adapt to your emotional state and spiritual needs.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mr-2">
                <i className="ri-eye-line"></i>
              </div>
              <h4 className="text-white">Soul Insights</h4>
            </div>
            <p className="text-sm text-gray-300">
              Receive personalized insights about your spiritual journey, energy patterns, and growth opportunities.
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
          Continue to Rights Agreement
        </Button>
      </motion.div>
    </motion.div>
  );
}