import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Leaf, SunMedium } from "lucide-react";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Donation tiers with their data
const DONATION_TIERS = [
  {
    id: 'seed-planter',
    name: 'Seed Planter',
    icon: <Sparkles className="h-12 w-12 text-amber-500" />,
    description: 'Plant the seeds of growth. Your support nurtures our digital garden.',
    amountSuggestions: [500, 1000, 2500], // in cents
    color: 'from-amber-400 to-amber-300',
    benefits: [
      'Recognition in our community',
      'Digital Seed Planter badge',
      'Access to Seed Planter meditation',
    ]
  },
  {
    id: 'tree-tender',
    name: 'Tree Tender',
    icon: <Leaf className="h-12 w-12 text-emerald-600" />,
    description: 'Tend the growth of our collective wisdom tree. Help us branch out.',
    amountSuggestions: [5000, 7500, 10000], // in cents
    color: 'from-emerald-500 to-emerald-400',
    benefits: [
      'All Seed Planter benefits',
      'Tree Tender digital badge',
      'Early access to new features',
      'Monthly cosmic insight session',
    ]
  },
  {
    id: 'light-guardian',
    name: 'Light Guardian',
    icon: <SunMedium className="h-12 w-12 text-amber-600" />,
    description: 'Illuminate the path with your generous spirit. Become a beacon of light.',
    amountSuggestions: [15000, 25000, 50000], // in cents
    color: 'from-amber-600 to-amber-500',
    benefits: [
      'All Tree Tender benefits',
      'Light Guardian digital badge',
      'Private cosmic consultation',
      'Special mention in our Rights Agreement',
      'Voice in platform development',
    ]
  }
];

// The payment form component that appears once a tier/amount is selected
const DonationPaymentForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/donation-thank-you",
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment Successful",
          description: "Thank you for your generous support!",
        });
        navigate("/donation-thank-you");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500"
      >
        {isProcessing ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Complete Donation
          </span>
        )}
      </Button>
    </form>
  );
};

// The main page component
export default function SupportJourney() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getActualAmount = (): number | null => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) {
      // Convert dollar amount to cents
      return Math.round(parseFloat(customAmount) * 100);
    }
    return null;
  };

  const handleContinue = async () => {
    const amount = getActualAmount();
    if (!selectedTier || !amount || amount < 100) { // Minimum of $1.00
      toast({
        title: "Invalid Selection",
        description: "Please select a tier and enter a valid amount (minimum $1.00).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-donation-intent", {
        amount,
        tierId: selectedTier,
      });
      
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment Error",
        description: "Unable to initialize payment process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTierData = DONATION_TIERS.find(tier => tier.id === selectedTier);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 mb-4">
          Support Our Cosmic Journey
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your contribution helps nurture The Sephirots' growth and allows us to continue building a flourishing spiritual ecosystem. Choose how you'd like to participate.
        </p>
      </div>

      {!clientSecret ? (
        <>
          {/* Tier Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-700">Choose Your Support Path</h2>
            <RadioGroup value={selectedTier || ""} onValueChange={setSelectedTier} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DONATION_TIERS.map((tier) => (
                <div key={tier.id} className={`relative`}>
                  <RadioGroupItem
                    value={tier.id}
                    id={tier.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={tier.id}
                    className={`flex flex-col h-full p-4 border-2 rounded-xl bg-white
                      cursor-pointer transition-all duration-300 ease-in-out
                      peer-aria-checked:border-amber-500 peer-aria-checked:bg-amber-50
                      hover:border-amber-300 hover:bg-amber-50/50`}
                  >
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${tier.color}`}>
                        {tier.icon}
                      </div>
                    </div>
                    <div className="font-semibold text-lg text-center text-amber-800 mb-2">{tier.name}</div>
                    <p className="text-gray-600 text-sm text-center mb-4">{tier.description}</p>
                    <ul className="text-sm text-gray-700 space-y-1 mt-auto mb-2">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-amber-500 mr-2">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Amount Selection */}
          {selectedTier && (
            <Card className="mb-8 border-amber-200 shadow-md bg-gradient-to-br from-amber-50/50 to-white">
              <CardHeader>
                <CardTitle className="text-amber-800">Choose Your Donation Amount</CardTitle>
                <CardDescription>
                  Select a suggested amount or enter your own custom amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTierData?.amountSuggestions.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={selectedAmount === amount ? "default" : "outline"}
                        className={`${
                          selectedAmount === amount
                            ? "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white"
                            : "hover:bg-amber-50 border-amber-200 text-amber-800"
                        }`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ${(amount / 100).toFixed(2)}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex mt-4 items-center">
                    <Label htmlFor="customAmount" className="mr-2 text-amber-800">
                      Custom Amount:
                    </Label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="customAmount"
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        className="pl-8 border-amber-200 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleContinue}
                  disabled={isLoading || (!selectedAmount && !customAmount)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Continue to Payment
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <Card className="border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-amber-800">Complete Your Donation</CardTitle>
              <CardDescription className="text-center">
                {selectedTierData?.name} - ${getActualAmount() ? (getActualAmount()! / 100).toFixed(2) : "0.00"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#f59e0b',
                      colorBackground: '#ffffff',
                      colorText: '#6b7280',
                      colorDanger: '#ef4444',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <DonationPaymentForm clientSecret={clientSecret} />
              </Elements>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-500">
              <p>Your payment information is securely processed by Stripe.</p>
            </CardFooter>
          </Card>
          
          <Button
            variant="ghost"
            onClick={() => setClientSecret(null)}
            className="mt-4 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
          >
            ← Go back and modify your donation
          </Button>
        </div>
      )}
    </div>
  );
}