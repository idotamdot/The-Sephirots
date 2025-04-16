import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function DevLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function loginTestUser() {
      try {
        const response = await fetch('/api/dev/login-test-user');
        
        if (!response.ok) {
          throw new Error('Failed to login test user');
        }
        
        // Invalidate user cache to refresh the data
        queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
        
        toast({
          title: 'Development Login',
          description: 'Successfully logged in as test user',
        });
        
        // Wait a bit to ensure cache invalidation has time to work
        setTimeout(() => {
          // Go back to the previous page or home if there's no history
          navigate('/');
        }, 1000);
      } catch (error) {
        console.error('Error logging in test user:', error);
        toast({
          title: 'Login Error',
          description: 'Failed to login test user. See console for details.',
          variant: 'destructive',
        });
      }
    }
    
    loginTestUser();
  }, [navigate, toast, queryClient]);
  
  return (
    <div className="container py-8 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-purple-500 rounded-full"></div>
      <p className="mt-4 text-gray-600">Logging in test user for development...</p>
    </div>
  );
}