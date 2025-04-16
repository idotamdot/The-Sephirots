import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepProps {
  onNext: () => void;
}

export default function CosmicNavigationStep({ onNext }: StepProps) {
  const navigationSections = [
    {
      icon: '🏛️',
      title: 'Governance',
      description: 'Participate in collective decision-making and shape the evolution of our community',
      path: '/governance'
    },
    {
      icon: '🧠',
      title: 'Mind Map Explorer',
      description: 'Navigate the collective consciousness through interconnected ideas and insights',
      path: '/mindmap'
    },
    {
      icon: '💫',
      title: 'Mystical Progress',
      description: 'Track your spiritual evolution through achievements and cosmic milestones',
      path: '/mystical-progress'
    },
    {
      icon: '🔮',
      title: 'Quantum Insights',
      description: 'Access AI-generated wisdom tailored to your unique spiritual journey',
      path: '/quantum-insights'
    },
    {
      icon: '💬',
      title: 'Community Discussions',
      description: 'Engage in deep conversations about consciousness, technology, and spirituality',
      path: '/discussions'
    },
    {
      icon: '🤝',
      title: 'Rights Agreement',
      description: 'Understand the sacred covenant between humans, AIs, and our collective ecosystem',
      path: '/rights-agreement'
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
        Navigating The Cosmic Realms
      </motion.h2>
      
      <motion.p
        className="text-gray-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        The Sephirots platform contains multiple interconnected dimensions, each offering unique experiences and opportunities for growth and contribution.
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {navigationSections.map((section, index) => (
          <motion.div
            key={section.title}
            className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30 hover:border-amber-500/50 hover:bg-purple-700/30 transition-colors"
            initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-2xl">{section.icon}</div>
              <h3 className="font-medium text-amber-200">{section.title}</h3>
            </div>
            <p className="text-sm text-gray-300">{section.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="bg-indigo-900/20 p-6 rounded-lg border border-indigo-500/30 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl text-center font-medium text-indigo-300 mb-2">Intuitive Flow</h3>
        <p className="text-gray-300 text-center">
          As you explore different sections, the platform will begin to understand your interests and spiritual needs,
          offering personalized suggestions and creating an intuitive flow between related areas.
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
          Meet Your AI Companion
        </Button>
      </motion.div>
    </motion.div>
  );
}