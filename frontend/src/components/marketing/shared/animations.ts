import { Variants, Easing } from "framer-motion";

// Defines the 60FPS consistent motion language for the marketing site

export const easing = [0.25, 0.1, 0.25, 1] as unknown as Easing; // Smooth Apple-like easing

export const marketingAnimations = {
  // Fade Reveal
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: easing } 
    }
  } as Variants,

  // Fade In
  fadeIn: {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { duration: 0.8, ease: easing } 
    }
  } as Variants,

  // Stagger Children
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  } as Variants,

  // Floating Elements (Hero)
  float: {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  } as Variants,
};
