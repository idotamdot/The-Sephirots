import { cn } from '@/lib/utils';

interface DoveAndStarsProps {
  className?: string;
  fillColor?: string;
  glowColor?: string;
  showStars?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
}

const sizesMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export default function DoveAndStars({ 
  className, 
  fillColor = "currentColor", 
  glowColor = "#a855f7",
  showStars = true,
  size = 'md',
  withGlow = false
}: DoveAndStarsProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={cn(sizesMap[size], 'inline-block', className)}
      fill={fillColor}
    >
      <defs>
        {withGlow && (
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor={glowColor} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      
      {/* Circle Background */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke={fillColor} 
        strokeWidth="2" 
        opacity="0.8" 
        filter={withGlow ? "url(#glow)" : undefined}
      />
      
      {/* Dove */}
      <g 
        transform="translate(50, 50) scale(0.7) translate(-50, -50)" 
        filter={withGlow ? "url(#glow)" : undefined}
      >
        <path d="M50 30c-5 0-9 4-12 8-3 4-4 8-3 12 1 3 3 5 6 6 3 1 7 0 10-2 3-2 5-5 6-9 1-4 0-8-2-11-1-2-3-3-5-4zm-5 10c1-1 3-1 4 0s1 3 0 4-3 1-4 0-1-3 0-4z" />
        <path d="M65 25c-3-3-7-4-10-3-3 1-5 3-6 6-1 3 0 7 2 10s5 5 9 6c4 1 8 0 11-2 3-2 4-5 3-8-1-3-4-6-9-9zm-5 10c1-1 3-1 4 0s1 3 0 4-3 1-4 0-1-3 0-4z" />
        <path d="M45 40c-6 6-8 14-6 20 2 6 8 10 16 10 1 0 3 0 4-1-2 4-5 7-8 9-3 2-6 3-9 3-2 0-4-1-5-2-1-1-2-3-2-5s1-4 2-6c1-2 3-4 5-5 2-1 5-2 7-2 1 0 2 0 3 1 1-2 2-4 2-6 0-2-1-4-2-5-1-1-3-2-5-2-2 0-4 1-6 3-2 2-4 5-5 8-1 3-1 6 0 8 1 2 2 4 4 5 2 1 4 1 6 0-3 4-6 6-9 6-3 0-6-1-8-3-2-2-3-5-3-8 0-3 1-7 3-10 2-3 6-7 10-10 4-3 9-4 13-4 4 0 7 1 10 3 3 2 5 5 5 8 0 3-1 7-3 10-2 3-6 6-10 8-4 2-9 2-13 1-4-1-7-3-9-6-2-3-2-7-1-10 1-3 3-7 6-9z" />
      </g>
      
      {/* Stars */}
      {showStars && (
        <g filter={withGlow ? "url(#glow)" : undefined}>
          {/* Star 1 */}
          <path d="M30 25L31.8 30.1H37.2L32.7 33.2L34.5 38.3L30 35.2L25.5 38.3L27.3 33.2L22.8 30.1H28.2L30 25Z" />
          
          {/* Star 2 */}
          <path d="M75 25L76.8 30.1H82.2L77.7 33.2L79.5 38.3L75 35.2L70.5 38.3L72.3 33.2L67.8 30.1H73.2L75 25Z" />
          
          {/* Star 3 */}
          <path d="M50 65L51.8 70.1H57.2L52.7 73.2L54.5 78.3L50 75.2L45.5 78.3L47.3 73.2L42.8 70.1H48.2L50 65Z" />
        </g>
      )}
    </svg>
  );
}