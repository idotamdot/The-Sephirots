import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

type OnboardingStep = 
  | 'welcome' 
  | 'interface-overview' 
  | 'cosmic-navigation' 
  | 'companion-introduction' 
  | 'rights-agreement' 
  | 'community' 
  | 'completed';

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  startOnboarding: () => void;
  nextStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  setCurrentStep: (step: OnboardingStep) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'interface-overview',
  'cosmic-navigation',
  'companion-introduction',
  'rights-agreement',
  'community',
  'completed'
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage to see if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
      setHasCompletedOnboarding(true);
    }
  }, []);

  useEffect(() => {
    // Auto-start onboarding for new users who haven't completed it
    if (user && !hasCompletedOnboarding && !isOnboarding) {
      setIsOnboarding(true);
    }
  }, [user, hasCompletedOnboarding, isOnboarding]);

  const stepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const totalSteps = ONBOARDING_STEPS.length - 1; // Exclude 'completed' from count
  const progress = Math.round((stepIndex / (totalSteps - 1)) * 100);

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep('welcome');
  };

  const nextStep = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        stepIndex,
        totalSteps,
        progress,
        startOnboarding,
        nextStep,
        skipOnboarding,
        completeOnboarding,
        setCurrentStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};