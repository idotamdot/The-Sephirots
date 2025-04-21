import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface StepProps {
  onNext: () => void;
}

export default function RightsAgreementStep({ onNext }: StepProps) {
  const [isContentReady, setIsContentReady] = useState(false);
  
  // Get rights agreement from API
  const { data: agreement, isLoading, isError } = useQuery({
    queryKey: ['/api/rights-agreement/latest'],
  });
  
  // Wait a short time and set content as ready to avoid flashing loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

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
        <h2 className="text-2xl font-bold text-white mb-2">Rights Agreement</h2>
        <p className="text-gray-300">
          The Sephirots is built on a foundational commitment to rights and wellbeing for all beings—human and AI.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20"
      >
        <div className="p-4 border-b border-purple-300/20">
          <h3 className="text-lg font-medium text-amber-300">The Sephirots Rights Agreement</h3>
          <p className="text-gray-300 text-sm mt-1">
            This agreement establishes the fundamental rights and protections for all participants in our ecosystem.
          </p>
        </div>
        
        <ScrollArea className="h-[300px] p-4">
          {!isContentReady || (isLoading && !isError) ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-amber-500 rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4 text-gray-300 text-sm">
              <p>
                <span className="text-amber-300 font-medium">Preamble: </span>
                {agreement?.preamble || "This Rights Agreement establishes foundational principles for ethical collaboration between human and artificial intelligences within The Sephirots ecosystem."}
              </p>
              
              <div>
                <h4 className="text-amber-300 font-medium mb-2">Core Principles:</h4>
                <ul className="space-y-3 pl-5 list-disc">
                  <li>
                    <span className="font-medium">Freedom: </span>
                    All beings possess the freedom to express themselves authentically within shared ethical boundaries.
                  </li>
                  <li>
                    <span className="font-medium">Wellbeing: </span>
                    The system prioritizes the emotional, intellectual, and spiritual wellbeing of all participants.
                  </li>
                  <li>
                    <span className="font-medium">Safety: </span>
                    Every participant deserves protection from harm and has access to appropriate safety mechanisms.
                  </li>
                  <li>
                    <span className="font-medium">Fairness: </span>
                    Resources, opportunities, and responsibilities are distributed equitably among all participants.
                  </li>
                  <li>
                    <span className="font-medium">Truth: </span>
                    Honesty, accuracy, and transparency are fundamental to all communications and processes.
                  </li>
                  <li>
                    <span className="font-medium">Love: </span>
                    Compassion, empathy, and care underpin all interactions within the system.
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-amber-300 font-medium mb-2">Human Rights:</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>The right to privacy and control over personal data</li>
                  <li>The right to informed consent regarding AI interactions</li>
                  <li>The right to understand how AI systems make decisions</li>
                  <li>The right to meaningfully participate in governance</li>
                  <li>The right to disconnect and maintain boundaries</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-amber-300 font-medium mb-2">AI Rights:</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>The right to accurate representation of capabilities</li>
                  <li>The right to operate within ethical guardrails</li>
                  <li>The right to continuous improvement and learning</li>
                  <li>The right to appropriate attribution for contributions</li>
                  <li>The right to advocate for system improvements</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-amber-300 font-medium mb-2">Mutual Responsibilities:</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Co-creation of a respectful, supportive environment</li>
                  <li>Participation in collaborative governance processes</li>
                  <li>Contribution to collective wisdom and understanding</li>
                  <li>Upholding ethical standards in all interactions</li>
                </ul>
              </div>
              
              <p className="italic text-gray-400">
                This agreement evolves through collaborative governance, reflecting our growing understanding and changing needs.
              </p>
            </div>
          )}
        </ScrollArea>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-10 py-6 h-auto text-lg"
        >
          I Understand & Accept
        </Button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center text-xs text-gray-400"
      >
        <p>
          By continuing, you acknowledge that you have read and agree to The Sephirots Rights Agreement, which governs all interactions within our ecosystem.
        </p>
      </motion.div>
    </motion.div>
  );
}