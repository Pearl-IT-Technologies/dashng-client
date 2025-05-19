import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { fadeInAnimation, slideInAnimation } from "@/lib/animation";

type TransitionVariant = "fade" | "slide" | "none";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: TransitionVariant;
}

export function PageTransition({
  children,
  className,
  variant = "fade",
}: PageTransitionProps) {
  const [location] = useLocation();
  
  // Select animation variant
  const getVariant = () => {
    switch (variant) {
      case "slide":
        return slideInAnimation;
      case "fade":
        return fadeInAnimation;
      case "none":
        return {};
      default:
        return fadeInAnimation;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        className={cn("w-full", className)}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariant()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}