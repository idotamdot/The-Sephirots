import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Make sure we have the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Donation tier mapping for display purposes
const DONATION_TIERS = {
  'seed-planter': {
    name: 'Seed Planter',
    icon: '🌱',
    color: 'from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/20'
  },
  'tree-tender': {
    name: 'Tree Tender',
    icon: '🌳',
    color: 'from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-900/20'
  },
  'light-guardian': {
    name: 'Light Guardian',
    icon: '✨',
    color: 'from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20'
  }
};

// Payment form component
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/donation-thank-you',
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Something went wrong.');
      toast({
        title: 'Payment Failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
    // Payment confirmPayment will redirect to return_url on success
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800/30">
          {errorMessage}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600" 
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
          </span>
        ) : (
          'Complete Donation'
        )}
      </Button>
    </form>
  );
};

export default function Payment() {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Get params from URL
    const clientSecret = searchParams.get('client_secret');
    const paymentIntent = searchParams.get('payment_intent');
    const tier = searchParams.get('tier');

    if (!clientSecret || !paymentIntent) {
      toast({
        title: 'Missing Payment Information',
        description: 'Required payment information is missing. Please try again.',
        variant: 'destructive',
      });
      navigate('/donate');
      return;
    }

    setClientSecret(clientSecret);
    setPaymentIntent(paymentIntent);
    setTier(tier);
  }, [searchParams, navigate, toast]);

  if (!clientSecret || !tier) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Use the tier information for display
  const tierInfo = DONATION_TIERS[tier as keyof typeof DONATION_TIERS] || {
    name: 'Contribution',
    icon: '💖',
    color: 'from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20'
  };

  const options: {
    clientSecret: string;
    appearance: {
      theme: 'stripe' | 'flat' | 'night';
    }
  } = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent mb-3">
          Complete Your {tierInfo.name} Donation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          You're just one step away from contributing to The Sephirots collective wisdom journey.
        </p>
      </div>

      <Card className={`mb-8 border border-purple-200 dark:border-purple-800/30 bg-gradient-to-br ${tierInfo.color}`}>
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl">{tierInfo.icon}</span>
          </div>
          <CardTitle className="text-center text-xl text-purple-700 dark:text-purple-300">
            {tierInfo.name} Contribution
          </CardTitle>
          <CardDescription className="text-center">
            Enter your payment details below to complete your donation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm />
            </Elements>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-xs text-gray-500">
          <p>Your payment is processed securely by Stripe.</p>
          <p>50% of your donation supports The Sephirots platform and 50% goes to Replit staff.</p>
        </CardFooter>
      </Card>
    </div>
  );
}