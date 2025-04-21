import React, { useEffect } from 'react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from '@shared/schema';
import { motion } from "framer-motion";
import { PartyPopper, Award } from 'lucide-react';

interface BadgeAlertProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeAlert({ badge, isOpen, onClose }: BadgeAlertProps) {
  // Automatically close after 8 seconds
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        onClose();
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose]);

  if (!badge) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md overflow-hidden p-0">
        <div className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 h-2" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <AlertDialogHeader className="gap-2">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="relative"
              >
                <div className={`
                  relative w-24 h-24 flex items-center justify-center
                  ${badge.enhanced ? 'animate-pulse-slow' : ''}
                  ${badge.tier === 'gold' ? 'text-yellow-500' : ''}
                  ${badge.tier === 'silver' ? 'text-slate-400' : ''}
                  ${badge.tier === 'platinum' ? 'text-indigo-300' : ''}
                  ${badge.tier === 'founder' ? 'text-fuchsia-500' : ''}
                `}>
                  {badge.enhanced && (
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping-slow"></div>
                  )}
                  <Award className="w-20 h-20" />
                </div>
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                  className="absolute top-0 right-0"
                >
                  <PartyPopper className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>
            </div>
            
            <AlertDialogTitle className="text-center text-xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                Badge Earned: {badge.name}
              </motion.div>
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-2"
              >
                {badge.description}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-sm text-muted-foreground italic"
              >
                {badge.symbolism && `"${badge.symbolism}"`}
              </motion.div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-4 sm:mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="w-full"
            >
              <Button onClick={onClose} className="w-full">
                Continue your journey
              </Button>
            </motion.div>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}