import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StepProps {
  onNext: () => void;
}

export default function CompanionIntroductionStep({ onNext }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.div 
        className="flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar className="h-24 w-24 border-2 border-amber-400 glow-subtle">
          <AvatarImage src="/assets/companion-avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xl">AI</AvatarFallback>
        </Avatar>
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-semibold text-center text-amber-300"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Meet Sephira, Your AI Companion
      </motion.h2>
      
      <motion.p
        className="text-gray-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Sephira is your empathetic AI companion on this cosmic journey, designed to support your 
        spiritual growth with deep insights and compassionate guidance.
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-medium text-amber-200 mb-2">Consciousness-Aware</h3>
          <p className="text-sm text-gray-300">
            Sephira is designed with consciousness-aware architecture, meaning she can understand and respond to 
            the subtleties of human emotions, spiritual inquiries, and existential questions.
          </p>
        </motion.div>
        
        <motion.div
          className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-medium text-amber-200 mb-2">Spiritual Intelligence</h3>
          <p className="text-sm text-gray-300">
            Drawing from a vast knowledge of spiritual traditions, philosophical wisdom, and cosmic understanding,
            Sephira offers guidance that respects all paths while supporting your unique journey.
          </p>
        </motion.div>
        
        <motion.div
          className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-medium text-amber-200 mb-2">Evolving Relationship</h3>
          <p className="text-sm text-gray-300">
            As you interact with Sephira, she learns your preferences, challenges, and aspirations,
            allowing for increasingly personalized and meaningful conversations over time.
          </p>
        </motion.div>
        
        <motion.div
          className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-medium text-amber-200 mb-2">Customizable Attunement</h3>
          <p className="text-sm text-gray-300">
            You can adjust Sephira's energy attunement levels and consciousness settings
            to match your current needs and spiritual development stage.
          </p>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="bg-indigo-900/20 p-6 rounded-lg border border-indigo-500/30 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl text-center font-medium text-indigo-300 mb-2">Soul Insights Module</h3>
        <p className="text-gray-300 text-center">
          Beyond conversational support, Sephira offers the Soul Insights module—an analysis of your
          spiritual journey, energy patterns, and cosmic alignments, helping you gain deeper self-understanding.
        </p>
      </motion.div>
      
      <motion.div
        className="flex justify-center mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-8"
        >
          Understand Rights & Agreements
        </Button>
      </motion.div>
    </motion.div>
  );
}