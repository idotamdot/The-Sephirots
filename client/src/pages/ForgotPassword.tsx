import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, SendIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username && !email) {
      toast({
        title: "Missing Information",
        description: "Please enter either your username or email.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", { username, email });
      const data = await response.json();
      
      if (data.success) {
        setIsSubmitted(true);
      } else {
        toast({
          title: "Request Failed",
          description: data.message || "There was a problem processing your request. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast({
        title: "Request Failed",
        description: error.message || "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="border-amber-200 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-center">
              If an account exists with the information you provided, we've sent instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center p-6">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <SendIcon className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-gray-600 mb-6">
              Please check your email inbox for the password reset link. The link will expire in 1 hour.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="border-amber-200 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your username or email address and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="text-center text-sm text-gray-500">- OR -</div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            className="text-amber-600 hover:text-amber-800"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}