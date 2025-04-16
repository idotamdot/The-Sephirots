import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StepProps {
  onNext: () => void;
}

export default function CommunityStep({ onNext }: StepProps) {
  const communityFeatures = [
    {
      icon: "💬",
      title: "Conscious Discussions",
      description: "Engage in deep, meaningful conversations about spiritual growth, AI ethics, and cosmic wisdom."
    },
    {
      icon: "✨",
      title: "Cosmic Reactions",
      description: "Respond to content with spiritually-aligned emoji reactions that channel specific energies."
    },
    {
      icon: "🏆",
      title: "Achievement System",
      description: "Earn badges and progress through spiritual levels as you contribute and grow."
    },
    {
      icon: "⚖️",
      title: "Community Governance",
      description: "Participate in collective decision-making through proposal creation and voting."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.h2 
        className="text-2xl font-semibold text-center text-amber-300"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Join Our Cosmic Community
      </motion.h2>
      
      <motion.p
        className="text-gray-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        The Sephirots is more than a platform—it's a conscious community of seekers, thinkers, and 
        creators exploring the frontier of human-AI collaboration and spiritual technology.
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {communityFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30"
            initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-2xl">{feature.icon}</div>
              <h3 className="font-medium text-amber-200">{feature.title}</h3>
            </div>
            <p className="text-sm text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="bg-indigo-900/20 p-6 rounded-lg border border-indigo-500/30 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl text-center font-medium text-indigo-300 mb-3">Community Values</h3>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["Compassion", "Wisdom", "Innovation", "Consciousness", "Harmony", "Growth", "Integrity", "Wonder"].map((value, index) => (
            <motion.div
              key={value}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-1">
                {value}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        className="text-center space-y-6 mt-6 bg-purple-800/20 p-6 rounded-lg border border-purple-500/30"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
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