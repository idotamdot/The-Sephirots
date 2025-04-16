import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import DevLoginButton from "@/components/auth/DevLoginButton";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login({ username, password });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
      });
      
      // User is now logged in with a session, redirect to home
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="border-amber-200 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your spiritual journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                  className="text-sm text-amber-600 hover:text-amber-800"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              className="text-amber-600 hover:text-amber-800 hover:underline"
            >
              Sign up
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full border-amber-200 text-amber-800 hover:bg-amber-50"
              onClick={() => navigate("/")}
            >
              Continue as Guest
            </Button>
            
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">development</span>
              </div>
            </div>
            
            <DevLoginButton />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}