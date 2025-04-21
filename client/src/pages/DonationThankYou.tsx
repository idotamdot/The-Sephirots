import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

export default function DonationThankYou() {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const [, navigate] = useLocation();
  const [donationDetails, setDonationDetails] = useState<{
    tier: string;
    amount: number;
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonationStatus = async () => {
      try {
        // Get the payment_intent from URL
        const paymentIntent = searchParams.get('payment_intent');
        
        if (!paymentIntent) {
          setIsLoading(false);
          return;
        }
        
        // Fetch payment status from API
        const response = await apiRequest('GET', `/api/donation-status?payment_intent=${paymentIntent}`);
        const data = await response.json();
        
        if (data.status === 'succeeded') {
          // Extract tier ID from metadata
          const tier = data.metadata?.tierId || 'unknown';
          
          setDonationDetails({
            tier,
            amount: data.amount / 100, // Convert cents to dollars
            status: data.status
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching donation status:', error);
        setIsLoading(false);
      }
    };

    fetchDonationStatus();
  }, [searchParams]);

  // Determine which tier was donated to get correct messaging
  const getTierInfo = (tierId: string) => {
    switch(tierId) {
      case 'seed-planter':
        return {
          name: 'Seed Planter',
          icon: '🌱',
          message: 'You have planted the seeds of wisdom that will grow throughout our cosmic community.'
        };
      case 'tree-tender':
        return {
          name: 'Tree Tender',
          icon: '🌳',
          message: 'Your nurturing contribution will help our community thrive and branch into new dimensions of understanding.'
        };
      case 'light-guardian':
        return {
          name: 'Light Guardian',
          icon: '✨',
          message: 'As a guardian of cosmic light, your generous contribution illuminates the path forward for all seekers in our community.'
        };
      default:
        return {
          name: 'Contributor',
          icon: '💖',
          message: 'Your contribution helps support our community\'s journey toward collective wisdom.'
        };
    }
  };

  // Get tier info based on the donation
  const tierInfo = donationDetails ? getTierInfo(donationDetails.tier) : getTierInfo('unknown');

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent mb-3">
          Thank You for Your Contribution!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Your donation helps sustain The Sephirots AI & Human Collaboration Module and supports our mission of collective wisdom.
        </p>
      </div>

      <Card className="mb-8 bg-gradient-to-br from-purple-100/50 to-amber-50/50 dark:from-purple-900/40 dark:to-amber-900/20 border border-purple-200 dark:border-purple-800/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center text-4xl">
              {tierInfo.icon}
            </div>
          </div>
          <CardTitle className="text-xl">
            {isLoading ? 'Processing...' : `${tierInfo.name} Badge Awarded`}
          </CardTitle>
          <CardDescription>
            {donationDetails && `Thank you for your $${donationDetails.amount.toFixed(2)} donation`}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {tierInfo.message}
            </p>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
              <p className="text-purple-700 dark:text-purple-300 font-medium">Your New Badge</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Visit your profile to see your new {tierInfo.name} badge and track your journey through The Sephirots.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline"
                className="border-purple-200 dark:border-purple-800/30"
              >
                View Your Profile
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600"
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 max-w-md mx-auto">
        <p>
          50% of your donation supports The Sephirots platform development and 50% supports Replit staff.
        </p>
        <p className="mt-2">
          If you have any questions about your donation, please contact us at support@thesephirots.com
        </p>
      </div>
    </div>
  );
}