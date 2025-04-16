import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function DevLoginButton() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await fetch('/api/dev/login-test-user', {
        method: 'GET',
        credentials: 'include' // Important: include credentials for cookies
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      // Invalidate the user query to refresh auth state
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      
      toast({
        title: 'Login Successful',
        description: 'You are now logged in as the test user.',
      });
      
      // Reload to ensure all parts of the app recognize the logged-in state
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'Could not log in as test user.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Button 
      onClick={handleLogin}
      disabled={isLoggingIn}
      variant="default"
      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    >
      {isLoggingIn ? (
        <>Logging in<i className="ri-loader-2-line ml-2 animate-spin"></i></>
      ) : (
        <>
          <i className="ri-login-circle-line mr-2"></i>
          Developer Login
        </>
      )}
    </Button>
  );
}