import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/use-onboarding';
import { X } from 'lucide-react';

// Onboarding Step Components
import WelcomeStep from './steps/WelcomeStep';
import InterfaceOverviewStep from './steps/InterfaceOverviewStep';
import CosmicNavigationStep from './steps/CosmicNavigationStep';
import CompanionIntroductionStep from './steps/CompanionIntroductionStep';
import RightsAgreementStep from './steps/RightsAgreementStep';
import CommunityStep from './steps/CommunityStep';

export default function OnboardingJourney() {
  const { 
    isOnboarding, 
    currentStep, 
    nextStep, 
    skipOnboarding, 
    completeOnboarding,
    progress 
  } = useOnboarding();
  const [, navigate] = useLocation();
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  
  // Handle onboarding step redirection if needed
  useEffect(() => {
    if (!isOnboarding) return;
    
    if (currentStep === 'companion-introduction') {
      navigate('/ai-companion');
    } else if (currentStep === 'rights-agreement') {
      navigate('/rights-agreement');
    } else if (currentStep === 'community') {
      navigate('/discussions');
    } else if (currentStep === 'completed') {
      completeOnboarding();
      navigate('/');
    }
  }, [currentStep, navigate, completeOnboarding, isOnboarding]);
  
  // Only display if onboarding is active
  if (!isOnboarding) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={nextStep} />;
      case 'interface-overview':
        return <InterfaceOverviewStep onNext={nextStep} />;
      case 'cosmic-navigation':
        return <CosmicNavigationStep onNext={nextStep} />;
      case 'companion-introduction':
        return <CompanionIntroductionStep onNext={nextStep} />;
      case 'rights-agreement':
        return <RightsAgreementStep onNext={nextStep} />;
      case 'community':
        return <CommunityStep onNext={nextStep} />;
      default:
        return null;
    }
  };

  const handleExit = () => {
    setExitConfirmOpen(true);
  };

  const confirmExit = () => {
    skipOnboarding();
    setExitConfirmOpen(false);
  };

  const cancelExit = () => {
    setExitConfirmOpen(false);
  };

  return (
    <AnimatePresence>
      {isOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-3xl min-h-[60vh] max-h-[90vh] overflow-auto bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg shadow-xl rounded-2xl border border-purple-500/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 py-3 px-6 border-b border-purple-500/20 backdrop-blur-md bg-purple-950/50 z-10">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-amber-400">Cosmic Onboarding Journey</h2>
                <p className="text-xs text-gray-300">Follow the path to cosmic understanding</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExit}
                className="text-gray-400 hover:text-white hover:bg-purple-800/30"
              >
                <X size={18} />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="px-6 py-2 bg-purple-950/30">
              <Progress value={progress} className="h-2 bg-gray-700">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: `${progress}%` }} />
              </Progress>
              <p className="text-xs text-gray-400 mt-1 text-right">{progress}% complete</p>
            </div>
            
            {/* Step Content */}
            <div className="p-6">
              {renderStepContent()}
            </div>
          </motion.div>
          
          {/* Exit Confirmation Modal */}
          <AnimatePresence>
            {exitConfirmOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                onClick={cancelExit}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-xl shadow-lg max-w-md mx-4"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold text-amber-400 mb-2">Skip Onboarding?</h3>
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to skip the cosmic onboarding journey? You can always restart it later from your profile settings.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={cancelExit} className="border-purple-500 text-purple-300 hover:bg-purple-800/30">
                      Continue Journey
                    </Button>
                    <Button onClick={confirmExit} className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800">
                      Skip Onboarding
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}