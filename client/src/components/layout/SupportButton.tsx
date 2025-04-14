import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HiSparkles } from 'react-icons/hi';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportButton() {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative">
      <Button
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 transition-all duration-300 text-white font-medium py-2 px-4 rounded-lg hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setLocation('/support-journey')}
      >
        <HiSparkles className="text-yellow-200" />
        <span>Support the Journey</span>
      </Button>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded-md py-2 px-3 w-max pointer-events-none z-50"
          >
            <div className="relative">
              <p className="whitespace-nowrap">Plant a light in the Sephirotic Grove</p>
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle sparkle effects */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-200 blur-sm"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-purple-300 blur-sm"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="absolute top-1/2 -translate-y-1/2 -right-2 w-2.5 h-2.5 rounded-full bg-amber-300 blur-sm"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}