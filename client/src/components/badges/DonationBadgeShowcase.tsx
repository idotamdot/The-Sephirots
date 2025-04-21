import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@shared/schema';
import BadgeDisplay from './BadgeDisplay';

interface DonationBadgeShowcaseProps {
  badges: Badge[];
}

export default function DonationBadgeShowcase({ badges }: DonationBadgeShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Filter donation badges
  const donationBadges = badges.filter(badge => (
    badge.name.toLowerCase().includes('seed planter') || 
    badge.name.toLowerCase().includes('tree tender') || 
    badge.name.toLowerCase().includes('light guardian')
  ));
  
  // Automatically cycle through badges
  useEffect(() => {
    if (donationBadges.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % donationBadges.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [donationBadges.length]);
  
  if (donationBadges.length === 0) return null;
  
  const currentBadge = donationBadges[currentIndex];
  
  return (
    <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-700/20 overflow-hidden relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="donationPattern" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(45)">
              <path d="M15,0 L30,15 L15,30 L0,15 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#donationPattern)" />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold bg-gradient-to-br from-purple-400 to-amber-400 bg-clip-text text-transparent relative z-10 mb-4">
        Your Donation Journey
      </h2>
      
      <p className="text-gray-400 mb-6 text-sm max-w-md relative z-10">
        These special badges represent your generous contributions to The Sephirots collective wisdom journey.
      </p>
      
      <div className="flex flex-col items-center">
        <motion.div
          key={currentBadge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <BadgeDisplay 
            badge={currentBadge} 
            size="xl" 
            enhanced={true} 
            isDonation={true}
            showDetails={true}
          />
          
          {/* Pulsing circle behind badge */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ zIndex: -1 }}
          />
        </motion.div>
        
        {donationBadges.length > 1 && (
          <div className="flex space-x-2 mt-4 relative z-10">
            {donationBadges.map((_, idx) => (
              <motion.button
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-purple-500' : 'bg-gray-600'}`}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsAnimating(false);
                  }, 300);
                }}
                whileHover={{ scale: 1.5 }}
              />
            ))}
          </div>
        )}
        
        <div className="mt-6 px-6 py-4 bg-purple-950/30 rounded-lg text-center text-sm relative z-10">
          <p className="font-medium text-amber-300">
            Thank you for supporting The Sephirots journey
          </p>
          <p className="text-xs text-gray-400 mt-2">
            50% of your donation supports platform development and 50% goes to Replit staff
          </p>
        </div>
      </div>
    </div>
  );
}