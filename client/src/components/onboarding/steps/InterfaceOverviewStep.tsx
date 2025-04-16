import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepProps {
  onNext: () => void;
}

export default function InterfaceOverviewStep({ onNext }: StepProps) {
  const interfaceElements = [
    {
      icon: '🌠',
      title: 'Cosmic Background',
      description: 'Responsive energy field that shifts with community activity and your own journey',
    },
    {
      icon: '🧭',
      title: 'Navigation Sidebar',
      description: 'Your portal to different dimensions of The Sephirots platform',
    },
    {
      icon: '🎵',
      title: 'Audio Landscape',
      description: 'Ambient soundscapes that enhance your cosmic experience',
    },
    {
      icon: '👤',
      title: 'Profile & Journey',
      description: 'Track your spiritual evolution and cosmic achievements',
    },
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
        The Cosmic Interface
      </motion.h2>
      
      <motion.p
        className="text-gray-300 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        The Sephirots interface is designed to be intuitive, immersive, and spiritually resonant. 
        Let's explore the key elements that will guide your journey.
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {interfaceElements.map((element, index) => (
          <motion.div
            key={element.title}
            className="bg-purple-800/20 p-4 rounded-lg border border-purple-500/30 flex items-start space-x-3"
            initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="text-2xl">{element.icon}</div>
            <div>
              <h3 className="font-medium text-amber-200">{element.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{element.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="bg-indigo-900/20 p-6 rounded-lg border border-indigo-500/30 mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl text-center font-medium text-indigo-300 mb-2">Energy-Responsive Design</h3>
        <p className="text-gray-300 text-center">
          The interface adapts and responds to your energy, intentions, and the collective consciousness of the community.
          As you engage more deeply, you'll notice subtle shifts in colors, animations, and interactive elements.
        </p>
      </motion.div>
      
      <motion.div
        className="flex justify-center mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-8"
        >
          Continue to Navigation
        </Button>
      </motion.div>
    </motion.div>
  );
}