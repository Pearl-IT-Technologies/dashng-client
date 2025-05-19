import { Variants } from "framer-motion";

// Common scale animation for interactive elements
export const scaleAnimation: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.97,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

// Button press animation
export const buttonPressAnimation: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.1,
    },
  },
};

// Floating animation for elements that need subtle movement
export const floatingAnimation: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Pulse animation for alerts or highlighting elements
export const pulseAnimation: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Slide in animation for entering elements
export const slideInAnimation: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Fade in animation for subtle transitions
export const fadeInAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Attention grabbing animation
export const attentionAnimation: Variants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

// Custom animation for form input focus
export const inputFocusAnimation: Variants = {
  initial: {
    borderColor: "var(--border)",
    boxShadow: "none",
  },
  focus: {
    borderColor: "var(--primary)",
    boxShadow: "0 0 0 2px rgba(var(--primary-rgb), 0.2)",
    transition: {
      duration: 0.2,
    },
  },
};

// Loading animation for buttons or content
export const loadingAnimation: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Add to cart button animation
export const addToCartAnimation: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 0.95, 1],
    transition: {
      duration: 0.8,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

// Success animation for completed actions
export const successAnimation: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "backOut",
    },
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "anticipate",
    },
  },
};

// Staggered children animation
export const staggeredContainer: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Child item for staggered animations
export const staggeredItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};