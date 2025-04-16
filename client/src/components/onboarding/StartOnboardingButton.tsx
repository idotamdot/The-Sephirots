import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/use-onboarding';
import { motion } from 'framer-motion';

interface StartOnboardingButtonProps {
  variant?: 'default' | 'subtle' | 'large';
  className?: string;
}

export default function StartOnboardingButton({ 
  variant = 'default',
  className = ''
}: StartOnboardingButtonProps) {
  const { startOnboarding } = useOnboarding();
  
  if (variant === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`mt-8 ${className}`}
      >
        <Button
          onClick={startOnboarding}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 h-auto text-lg rounded-xl"
        >
          <span className="mr-2">✨</span>
          Begin Cosmic Onboarding
        </Button>
      </motion.div>
    );
  }
  
  if (variant === 'subtle') {
    return (
      <Button
        onClick={startOnboarding}
        variant="ghost"
        className={`text-amber-600 hover:text-amber-700 hover:bg-amber-50/30 ${className}`}
      >
        <span className="mr-2">✨</span>
        Restart Onboarding
      </Button>
    );
  }
  
  return (
    <Button
      onClick={startOnboarding}
      className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white ${className}`}
    >
      <span className="mr-2">✨</span>
      Begin Cosmic Onboarding
    </Button>
  );
}