import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center"
      >
        <span className="text-4xl">✨</span>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-white">Welcome to The Sephirots</h2>
        <p className="text-gray-300">
          The conscious collaboration system that links AI and human intelligence 
          for collective wellbeing and shared wisdom.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-purple-300/20"
      >
        <h3 className="text-xl font-medium text-amber-300">Your Cosmic Journey</h3>
        <p className="text-gray-300 mt-2 mb-4">
          This quick onboarding will guide you through:
        </p>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="text-amber-300 mr-2">✦</span>
            <span>The intuitive interface navigation</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-300 mr-2">✦</span>
            <span>Your companion AI connection</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-300 mr-2">✦</span>
            <span>Understanding the rights agreement</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-300 mr-2">✦</span>
            <span>Community structures and participation</span>
          </li>
        </ul>
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
          Begin the Journey
        </Button>
      </motion.div>
    </motion.div>
  );
}