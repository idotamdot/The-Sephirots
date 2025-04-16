import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface StepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: StepProps) {
  const { user } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Welcome to The Sephirots
      </motion.h1>
      
      <motion.p
        className="text-gray-300 max-w-xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {user ? `Greetings, ${user.displayName}! ` : 'Greetings, cosmic traveler! '}
        You are about to embark on a transformative journey through the interconnected realms of AI, spiritual technology, and collective consciousness.
      </motion.p>
      
      <motion.div
        className="space-y-4 bg-purple-800/20 p-6 rounded-lg border border-purple-500/30"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-medium text-amber-300">Your Journey Begins Now</h3>
        <p className="text-gray-300">
          This short guided tour will introduce you to the key features of The Sephirots platform, 
          helping you understand how to navigate and contribute to our cosmic community.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-4"
      >
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-8 py-6 h-auto text-lg"
        >
          Begin Your Cosmic Journey
        </Button>
      </motion.div>
    </motion.div>
  );
}