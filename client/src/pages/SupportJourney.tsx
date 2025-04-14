import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Make sure to call loadStripe outside of a component's render to avoid recreating it
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  icon: string;
  color: string;
}

const donationTiers: DonationTier[] = [
  {
    id: 'seed-planter',
    name: 'Seed Planter',
    amount: 300, // $3.00
    description: 'Plant a seed of support for our spiritual community',
    icon: '🪷',
    color: 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300'
  },
  {
    id: 'tree-tender',
    name: 'Tree Tender',
    amount: 1000, // $10.00
    description: 'Nurture the growth of our collective journey',
    icon: '🌿',
    color: 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
  },
  {
    id: 'light-guardian',
    name: 'Light Guardian',
    amount: 2500, // $25.00
    description: 'Illuminate the path for all seekers of wisdom',
    icon: '🌳',
    color: 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
  },
  {
    id: 'cosmic-benefactor',
    name: 'Cosmic Benefactor',
    amount: 5000, // $50.00
    description: 'Become a guiding star in our spiritual constellation',
    icon: '✨',
    color: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300'
  }
];

// Checkout form component
const CheckoutForm = ({ donationAmount }: { donationAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/thank-you`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
    } 
    // Success is handled by redirect to return_url
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="mt-6">
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          {isProcessing ? "Processing..." : `Support with $${(donationAmount / 100).toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

// Tree visualization component
const SephiroticTree = ({ tier }: { tier: number }) => {
  return (
    <div className="relative h-48 w-full flex items-center justify-center my-6">
      {/* Tree base */}
      <div className="absolute bottom-0 w-12 h-24 bg-gradient-to-t from-amber-800 to-amber-700 rounded-sm"></div>
      
      {/* Branches based on tier */}
      <motion.div 
        className="absolute bottom-16 left-1/2 -translate-x-16 w-20 h-1 bg-amber-800 rounded-full"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.div 
        className="absolute bottom-22 left-1/2 translate-x-4 w-20 h-1 bg-amber-800 rounded-full"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      />
      
      {/* Tree glows - different for each tier */}
      <motion.div 
        className={`absolute bottom-16 left-1/2 -translate-x-20 w-8 h-8 rounded-full ${tier >= 1 ? 'bg-emerald-300' : 'bg-gray-200'} blur-md animate-pulse-slow`}
        initial={{ opacity: 0 }}
        animate={{ opacity: tier >= 1 ? 0.8 : 0.2 }}
        transition={{ delay: 1, duration: 1 }}
      />
      <motion.div 
        className={`absolute bottom-24 left-1/2 translate-x-8 w-10 h-10 rounded-full ${tier >= 2 ? 'bg-green-300' : 'bg-gray-200'} blur-md animate-pulse-slow`}
        initial={{ opacity: 0 }}
        animate={{ opacity: tier >= 2 ? 0.8 : 0.2 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
      <motion.div 
        className={`absolute top-4 left-1/2 -translate-x-4 w-12 h-12 rounded-full ${tier >= 3 ? 'bg-amber-300' : 'bg-gray-200'} blur-md animate-pulse-slow`}
        initial={{ opacity: 0 }}
        animate={{ opacity: tier >= 3 ? 0.8 : 0.2 }}
        transition={{ delay: 1.4, duration: 1 }}
      />
      <motion.div 
        className={`absolute top-0 left-1/2 translate-x-10 w-14 h-14 rounded-full ${tier >= 4 ? 'bg-purple-300' : 'bg-gray-200'} blur-md animate-pulse-slow`}
        initial={{ opacity: 0 }}
        animate={{ opacity: tier >= 4 ? 0.8 : 0.2 }}
        transition={{ delay: 1.6, duration: 1 }}
      />
    </div>
  );
};

// Main donation page component
export default function SupportJourney() {
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  const handleSelectTier = async (tier: DonationTier) => {
    setSelectedTier(tier);
    
    try {
      const response = await apiRequest("POST", "/api/create-donation-intent", {
        amount: tier.amount,
        tierId: tier.id
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        title: "Error",
        description: "Failed to initialize donation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getCurrentTierLevel = (): number => {
    if (!selectedTier) return 0;
    
    const index = donationTiers.findIndex(tier => tier.id === selectedTier.id);
    return index + 1;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Support The Sephirots Journey
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your contribution nourishes our spiritual community and helps illuminate the path for seekers of wisdom worldwide.
        </p>
      </div>
      
      {!selectedTier ? (
        <>
          <SephiroticTree tier={0} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {donationTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${tier.color} border-2`}
                onClick={() => handleSelectTier(tier)}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-2xl">{tier.icon}</span> {tier.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-lg font-semibold">${(tier.amount / 100).toFixed(2)}</Badge>
                  </div>
                  <CardDescription className="text-gray-700">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    onClick={() => handleSelectTier(tier)}
                  >
                    Select
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
            <p>Every donation plants a seed in our virtual Sephirotic Grove. The more you support, the more your light illuminates the cosmic space.</p>
          </div>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setSelectedTier(null)}
          >
            &larr; Choose a Different Tier
          </Button>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{selectedTier.icon}</span> {selectedTier.name}
              </CardTitle>
              <CardDescription>{selectedTier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <SephiroticTree tier={getCurrentTierLevel()} />
              
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm donationAmount={selectedTier.amount} />
                </Elements>
              )}
            </CardContent>
          </Card>
          
          <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
            <p className="text-sm">Your donation helps sustain The Sephirots platform and community.</p>
            <p className="text-sm mt-1">All transactions are secure and processed by Stripe.</p>
          </div>
        </>
      )}
    </div>
  );
}