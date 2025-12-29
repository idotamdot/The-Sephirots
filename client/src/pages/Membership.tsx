import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/transitions/PageTransition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, BookOpen, BarChart3, Users, MessageCircle, Star, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface MembershipTier {
  id: number;
  name: string;
  tier: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  lessonsAccess: boolean;
  trainingAccess: boolean;
  statisticsAccess: boolean;
  prioritySupport: boolean;
  maxMindMaps: number;
}

const tierIcons: Record<string, React.ReactNode> = {
  free: <Users className="w-8 h-8" />,
  seeker: <BookOpen className="w-8 h-8" />,
  adept: <Zap className="w-8 h-8" />,
  master: <Crown className="w-8 h-8" />,
  founder: <Star className="w-8 h-8" />,
};

const tierColors: Record<string, string> = {
  free: "from-gray-400 to-gray-500",
  seeker: "from-blue-400 to-blue-600",
  adept: "from-purple-400 to-purple-600",
  master: "from-amber-400 to-amber-600",
  founder: "from-rose-400 to-rose-600",
};

// Default tiers if API hasn't been set up yet
const defaultTiers: MembershipTier[] = [
  {
    id: 1,
    name: "Free",
    tier: "free",
    description: "Begin your journey with basic access. Complete our comprehensive course to maintain free access.",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Access to community discussions",
      "Basic profile customization",
      "3 mind maps",
      "View public polls",
      "Complete course for continued access",
    ],
    lessonsAccess: false,
    trainingAccess: false,
    statisticsAccess: false,
    prioritySupport: false,
    maxMindMaps: 3,
  },
  {
    id: 2,
    name: "Seeker",
    tier: "seeker",
    description: "For those beginning their path of discovery and growth.",
    priceMonthly: 999,
    priceYearly: 9990,
    features: [
      "Everything in Free",
      "Access to lesson library",
      "10 mind maps",
      "Vote in all polls",
      "Basic statistics access",
      "Community badge",
    ],
    lessonsAccess: true,
    trainingAccess: false,
    statisticsAccess: true,
    prioritySupport: false,
    maxMindMaps: 10,
  },
  {
    id: 3,
    name: "Adept",
    tier: "adept",
    description: "Enhanced access for dedicated practitioners on their journey.",
    priceMonthly: 1999,
    priceYearly: 19990,
    features: [
      "Everything in Seeker",
      "Full training programs",
      "Unlimited mind maps",
      "Advanced statistics",
      "Create community polls",
      "Priority support",
      "Exclusive badge tier",
    ],
    lessonsAccess: true,
    trainingAccess: true,
    statisticsAccess: true,
    prioritySupport: true,
    maxMindMaps: -1, // Unlimited
  },
  {
    id: 4,
    name: "Master",
    tier: "master",
    description: "Full access for those committed to mastery and community leadership.",
    priceMonthly: 4999,
    priceYearly: 49990,
    features: [
      "Everything in Adept",
      "1-on-1 guidance sessions",
      "Early access to new features",
      "Governance participation",
      "Custom training programs",
      "Master badge & recognition",
      "API access",
    ],
    lessonsAccess: true,
    trainingAccess: true,
    statisticsAccess: true,
    prioritySupport: true,
    maxMindMaps: -1,
  },
];

export default function Membership() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Fetch membership tiers
  const { data: tiers, isLoading } = useQuery<MembershipTier[]>({
    queryKey: ["membership-tiers"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/membership/tiers", {
          credentials: "include",
        });
        if (!response.ok) {
          // Return default tiers if API isn't available
          return defaultTiers;
        }
        return response.json();
      } catch {
        return defaultTiers;
      }
    },
    initialData: defaultTiers,
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async (tierId: number) => {
      const response = await fetch("/api/membership/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId, billingCycle }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to start subscription");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Subscription Started",
          description: "Welcome to your new membership tier!",
        });
        navigate("/profile");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (tierId: number, tierName: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a membership tier.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (tierName === "Free") {
      navigate("/course");
      return;
    }

    subscribeMutation.mutate(tierId);
  };

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getYearlySavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const annualMonthly = monthly * 12;
    return Math.round(((annualMonthly - yearly) / annualMonthly) * 100);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500 mb-4"
          >
            Choose Your Path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Unlock your full potential with access to lessons, training, and advanced features.
            All memberships include our community features and support.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-1"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "bg-white shadow-md text-amber-600 font-medium"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white shadow-md text-amber-600 font-medium"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Yearly
              <Badge className="bg-green-100 text-green-700 text-xs">
                Save up to {Math.max(...tiers.filter(t => t.priceMonthly > 0).map(t => getYearlySavings(t.priceMonthly, t.priceYearly)))}%
              </Badge>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, index) => {
            const isPopular = tier.tier === "adept";
            const price = billingCycle === "monthly" ? tier.priceMonthly : tier.priceYearly;
            const savings = getYearlySavings(tier.priceMonthly, tier.priceYearly);

            return (
              <StaggerItem key={tier.id}>
                <Card
                  className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-xl ${
                    isPopular ? "ring-2 ring-purple-400 shadow-lg scale-105" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                        tierColors[tier.tier]
                      } flex items-center justify-center text-white`}
                    >
                      {tierIcons[tier.tier]}
                    </div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="text-sm">{tier.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-gray-800">
                        {formatPrice(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-gray-500">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      )}
                      {billingCycle === "yearly" && savings > 0 && (
                        <p className="text-sm text-green-600 mt-1">Save {savings}%</p>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className={`w-full ${
                        isPopular
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                          : tier.tier === "free"
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                      }`}
                      onClick={() => handleSubscribe(tier.id, tier.name)}
                      disabled={subscribeMutation.isPending}
                    >
                      {tier.tier === "free" ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Start Course
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get Started
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Free Account via Course Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <BookOpen className="w-6 h-6" />
                Free Account Through Learning
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Maintain free access by completing our comprehensive course on understanding modern systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Learn Systems</h4>
                  <p className="text-sm text-gray-600">
                    Understand how modern systems work and how they affect everyone equally.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Find Common Ground</h4>
                  <p className="text-sm text-gray-600">
                    Discover the fundamental values that unite all living persons.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Create Unity</h4>
                  <p className="text-sm text-gray-600">
                    Help develop unifying goal suggestions for quality of life improvement.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => navigate("/course")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Free Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I cancel?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You'll continue to have access until the end of your current billing period. After that, you can maintain free access by completing our course.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our Free tier gives you basic access to explore the platform. You can upgrade anytime to unlock premium features.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards through Stripe. Your payment information is securely processed and never stored on our servers.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
