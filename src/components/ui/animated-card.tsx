import { Card } from "@/components/ui/card";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;
import { scaleAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

// Create a motion card component that extends the Card component
const MotionCard = motion(Card);

// AnimatedCard component extends the Card component with animations
export interface AnimatedCardProps extends Omit<CardProps, 'children'> {
  hoverEffect?: boolean;
  clickEffect?: boolean;
  children?: React.ReactNode;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hoverEffect = true, clickEffect = true, ...props }, ref) => {
    return (
      <MotionCard
        ref={ref}
        className={cn(className)}
        {...props}
        initial="initial"
        whileHover={hoverEffect ? "hover" : undefined}
        whileTap={clickEffect ? "tap" : undefined}
        variants={scaleAnimation}
      >
        {children}
      </MotionCard>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };