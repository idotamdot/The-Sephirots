import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

export default function DonationThankYou() {
  const [, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'failed'>('processing');
  const [treeGlow, setTreeGlow] = useState(0);
  
  // Get payment status from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get('payment_intent');
    const redirectStatus = params.get('redirect_status');
    
    if (!paymentIntentId) {
      setPaymentStatus('failed');
      return;
    }
    
    // Check status of payment intent
    const checkPaymentStatus = async () => {
      try {
        const response = await apiRequest('GET', `/api/donation-status?payment_intent=${paymentIntentId}`);
        const data = await response.json();
        
        if (data.status === 'succeeded' || redirectStatus === 'succeeded') {
          setPaymentStatus('success');
          
          // Increase tree glow effect over time
          let glow = 0;
          const interval = setInterval(() => {
            glow += 1;
            if (glow <= 5) {
              setTreeGlow(glow);
            } else {
              clearInterval(interval);
            }
          }, 600);
          
          return () => clearInterval(interval);
        } else if (data.status === 'processing' || redirectStatus === 'processing') {
          setPaymentStatus('processing');
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
      }
    };
    
    checkPaymentStatus();
  }, []);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {paymentStatus === 'success' ? 'Thank You for Your Support!' : 
             paymentStatus === 'processing' ? 'Processing Your Donation...' : 
             'Donation Unsuccessful'}
          </CardTitle>
          <CardDescription className="text-lg">
            {paymentStatus === 'success' ? 'Your light shines brightly in our Sephirotic Grove.' :
             paymentStatus === 'processing' ? 'Your donation is being processed. This may take a moment.' :
             'There was an issue processing your donation.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {paymentStatus === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative my-12 h-64 w-64"
              >
                {/* Tree trunk */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-32 bg-gradient-to-t from-amber-800 to-amber-700 rounded-sm"></div>
                
                {/* Branches */}
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -rotate-45 w-24 h-2 bg-amber-800 rounded-full origin-bottom-right"></div>
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 rotate-45 w-24 h-2 bg-amber-800 rounded-full origin-bottom-left"></div>
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 -rotate-25 w-16 h-1.5 bg-amber-800 rounded-full origin-bottom-right"></div>
                <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 rotate-25 w-16 h-1.5 bg-amber-800 rounded-full origin-bottom-left"></div>
                
                {/* Glowing orbs representing Sephirot */}
                <motion.div 
                  className="absolute bottom-20 left-1/4 w-10 h-10 rounded-full bg-emerald-300 blur-md"
                  animate={{ 
                    opacity: treeGlow >= 1 ? [0.6, 1, 0.6] : 0.2,
                    scale: treeGlow >= 1 ? [1, 1.2, 1] : 0.8
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    repeatType: "reverse"
                  }}
                ></motion.div>
                
                <motion.div 
                  className="absolute bottom-28 right-1/4 w-12 h-12 rounded-full bg-green-300 blur-md"
                  animate={{ 
                    opacity: treeGlow >= 2 ? [0.6, 1, 0.6] : 0.2,
                    scale: treeGlow >= 2 ? [1, 1.2, 1] : 0.8
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                ></motion.div>
                
                <motion.div 
                  className="absolute top-24 left-1/3 w-14 h-14 rounded-full bg-amber-300 blur-md"
                  animate={{ 
                    opacity: treeGlow >= 3 ? [0.6, 1, 0.6] : 0.2,
                    scale: treeGlow >= 3 ? [1, 1.2, 1] : 0.8
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4.5,
                    repeatType: "reverse",
                    delay: 1
                  }}
                ></motion.div>
                
                <motion.div 
                  className="absolute top-20 right-1/3 w-12 h-12 rounded-full bg-violet-300 blur-md"
                  animate={{ 
                    opacity: treeGlow >= 4 ? [0.6, 1, 0.6] : 0.2,
                    scale: treeGlow >= 4 ? [1, 1.2, 1] : 0.8
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5,
                    repeatType: "reverse",
                    delay: 1.5
                  }}
                ></motion.div>
                
                <motion.div 
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-purple-300 blur-md"
                  animate={{ 
                    opacity: treeGlow >= 5 ? [0.6, 1, 0.6] : 0.2,
                    scale: treeGlow >= 5 ? [1, 1.2, 1] : 0.8
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6,
                    repeatType: "reverse",
                    delay: 2
                  }}
                ></motion.div>
              </motion.div>
            )}
            
            {paymentStatus === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center"
              >
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400">Processing your donation...</p>
              </motion.div>
            )}
            
            {paymentStatus === 'failed' && (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 text-4xl">❌</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We couldn't process your donation. Please try again or contact support.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8 space-y-4 text-center">
            <Button 
              onClick={() => setLocation('/')}
              variant="outline"
              className="mr-4"
            >
              Return Home
            </Button>
            
            <Button 
              onClick={() => setLocation('/support-journey')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {paymentStatus === 'failed' ? 'Try Again' : 'Make Another Donation'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {paymentStatus === 'success' && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400 max-w-xl">
          <p className="mb-2">
            Your contribution helps sustain our spiritual community and empower fellow seekers on their journey.
          </p>
          <p>
            The light you've added to our Sephirotic Grove will continue to shine, illuminating the path for others.
          </p>
        </div>
      )}
    </div>
  );
}