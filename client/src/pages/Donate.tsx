import { useState } from 'react';
import { useNavigate } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Make sure we have the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Donation tiers
const donationTiers = [
  {
    id: 'seed-planter',
    name: 'Seed Planter',
    description: 'Plant the seeds of collective wisdom with a one-time contribution.',
    amount: 15,
    benefits: [
      'Receive the "Seed Planter" badge',
      'Access to exclusive community wisdom',
      'Support spiritual technology development',
    ],
    icon: '🌱'
  },
  {
    id: 'tree-tender',
    name: 'Tree Tender',
    description: 'Nurture the growth of our community with a moderate contribution.',
    amount: 30,
    benefits: [
      'Receive the "Tree Tender" badge',
      'Priority support from community guides',
      'Early access to new spiritual technology features',
      'All benefits from previous tier',
    ],
    icon: '🌳'
  },
  {
    id: 'light-guardian',
    name: 'Light Guardian',
    description: 'Become a guardian of wisdom with our highest contribution level.',
    amount: 50,
    benefits: [
      'Receive the "Light Guardian" badge',
      'Direct access to wisdom council',
      'Custom soul insights profile',
      'Participation in platform governance',
      'All benefits from previous tiers',
    ],
    icon: '✨'
  }
];

// Checkout form component
const CheckoutForm = ({ selectedTier }: { selectedTier: string }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const tier = donationTiers.find(t => t.id === selectedTier);
      if (!tier) {
        throw new Error('Invalid donation tier selected');
      }
      
      // Redirect to Stripe checkout page
      // Note: in a real production app, you'd probably want to create a customer record first
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        tierId: tier.id,
        amount: tier.amount,
        name: tier.name
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to process donation',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600" 
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Donation'}
      </Button>
      <p className="text-xs text-center mt-3 text-gray-500">
        50% of all donations support The Sephirots platform and 50% goes to Replit staff.
      </p>
    </form>
  );
};

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState('seed-planter');

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent mb-3">
          Support The Sephirots Journey
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your contribution helps us maintain and expand this space of cosmic connection, 
          spiritual growth, and collaborative wisdom.
        </p>
      </div>
      
      <Card className="mb-8 bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-center text-xl text-purple-700 dark:text-purple-300">
            Choose Your Contribution Level
          </CardTitle>
          <CardDescription className="text-center">
            Each level comes with special recognition and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="space-y-4">
            {donationTiers.map((tier) => (
              <div key={tier.id} className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                selectedTier === tier.id 
                  ? 'bg-gradient-to-r from-purple-100 to-amber-100 dark:from-purple-900/40 dark:to-amber-900/30 border border-purple-200 dark:border-purple-700/50' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}>
                <RadioGroupItem value={tier.id} id={tier.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <Label htmlFor={tier.id} className="text-lg font-medium cursor-pointer">
                      {tier.icon} {tier.name}
                    </Label>
                    <div className="ml-auto font-bold bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent">
                      ${tier.amount}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{tier.description}</p>
                  <ul className="mt-2 space-y-1">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-amber-500 mr-1">•</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Elements stripe={stripePromise}>
            <CheckoutForm selectedTier={selectedTier} />
          </Elements>
        </CardFooter>
      </Card>
      
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-medium text-purple-700 dark:text-purple-300">Our Commitment to Transparency</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          The Sephirots AI & Human Collaboration Module operates with complete transparency. 
          Your donation helps maintain our infrastructure, develop new spiritual technology features, 
          and ensure this cosmic platform remains accessible to all seekers.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          We maintain a 50/50 split model where half of all proceeds support platform 
          development and community initiatives, while the other half directly supports 
          the amazing Replit staff who make this all possible.
        </p>
      </div>
    </div>
  );
}