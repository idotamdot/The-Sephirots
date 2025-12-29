import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cosmicVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    rotateX: 5,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(5px)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CosmicPageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      variants={cosmicVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

// Fade transition for subtle page changes
export function FadeTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide-up transition for modals and panels
export function SlideUpTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }
      }}
      exit={{ 
        opacity: 0, 
        y: 30,
        transition: {
          duration: 0.3,
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation for lists
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
