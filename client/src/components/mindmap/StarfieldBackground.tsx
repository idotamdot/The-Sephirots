import { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  starsCount?: number;
  speed?: number;
  depth?: number;
  size?: number;
  backgroundColor?: string;
  starColor?: string;
  interactive?: boolean;
  className?: string;
}

export default function StarfieldBackground({
  starsCount = 300,
  speed = 0.3,
  depth = 300,
  size = 3,
  backgroundColor = 'rgba(10, 3, 30, 0.8)',
  starColor = '#ffffff',
  interactive = true,
  className = '',
}: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  // Initialize stars
  const initStars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    stars.current = [];

    for (let i = 0; i < starsCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * depth;
      const opacity = Math.random();
      const flicker = Math.random() > 0.8; // 20% of stars will flicker
      const flickerSpeed = 0.5 + Math.random() * 2;
      const psize = Math.random() * size; // Varying sizes
      const starColor = Math.random() > 0.9 ? 
        `rgba(255, ${180 + Math.floor(Math.random() * 75)}, ${100 + Math.floor(Math.random() * 155)}, ${opacity})` : // Some stars with amber/gold tint
        `rgba(255, 255, 255, ${opacity})`; // White stars

      stars.current.push({ x, y, z, opacity, psize, flicker, flickerSpeed, starColor });
    }
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    initStars();
  };

  // Handle mouse move for interactive mode
  const handleMouseMove = (e: MouseEvent) => {
    if (!interactive || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current = { 
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas with semi-transparent background for trail effect
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Update and draw stars
    stars.current.forEach(star => {
      // Move stars
      star.z -= speed;

      // Reset star if it moves too close
      if (star.z <= 0) {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
        star.z = depth;
        star.opacity = Math.random();
      }

      // Calculate projected position
      const factor = star.z / depth;
      const projectedX = (star.x - centerX) * factor + centerX;
      const projectedY = (star.y - centerY) * factor + centerY;

      // Calculate star size (smaller as they get "further")
      const starSize = (1 - factor) * star.psize;

      // Interactive effect - slight movement based on mouse position
      let x = projectedX;
      let y = projectedY;
      
      if (interactive) {
        const mouseDistance = Math.sqrt(
          Math.pow(mouse.current.x - centerX, 2) + 
          Math.pow(mouse.current.y - centerY, 2)
        );
        
        const mouseEffect = mouseDistance / Math.max(width, height) * 15 * (1 - factor);
        
        if (mouseDistance > 0) {
          x += ((mouse.current.x - centerX) / mouseDistance) * mouseEffect;
          y += ((mouse.current.y - centerY) / mouseDistance) * mouseEffect;
        }
      }

      // Handle flickering
      let opacity = star.opacity * (1 - factor);
      if (star.flicker) {
        const now = Date.now() / 1000;
        const flicker = (Math.sin(now * star.flickerSpeed) + 1) / 2; // 0 to 1
        opacity *= 0.7 + (flicker * 0.3); // Allow 30% opacity variation
      }

      // Draw star
      const glow = ctx.createRadialGradient(x, y, 0, x, y, starSize * 2);
      glow.addColorStop(0, star.starColor.replace(/[\d.]+\)$/, `${opacity})`));
      glow.addColorStop(1, star.starColor.replace(/[\d.]+\)$/, '0)'));
      
      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(x, y, starSize * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw star center
      ctx.beginPath();
      ctx.fillStyle = star.starColor.replace(/[\d.]+\)$/, `${opacity})`);
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add cosmic dust and nebula effect
    addCosmicDust(ctx, width, height);

    // Continue animation
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Add cosmic dust and nebula effects
  const addCosmicDust = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a few larger "nebula" spots with gradients
    const nebulaCount = 3;
    const time = Date.now() / 5000; // Slow pulsing
    
    for (let i = 0; i < nebulaCount; i++) {
      const x = width * (0.2 + (i * 0.3)); // Distribute across screen
      const y = height * (0.3 + Math.sin(time + i) * 0.2); // Gentle vertical movement
      const radius = (width * 0.15) * (0.8 + Math.sin(time * 1.5 + i) * 0.2); // Pulsing size
      
      // Nebula colors (purples and ambers for Sephirotic theme)
      const colors = [
        [148, 85, 247, 0.04], // Purple
        [251, 191, 36, 0.03], // Amber
        [168, 85, 247, 0.05]  // Violet
      ];
      
      const colorSet = colors[i % colors.length];
      
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, `rgba(${colorSet[0]}, ${colorSet[1]}, ${colorSet[2]}, ${colorSet[3] * 2})`);
      glow.addColorStop(0.5, `rgba(${colorSet[0]}, ${colorSet[1]}, ${colorSet[2]}, ${colorSet[3]})`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initial setup
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove as any);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove as any);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [speed, depth, size, interactive, backgroundColor, starColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}