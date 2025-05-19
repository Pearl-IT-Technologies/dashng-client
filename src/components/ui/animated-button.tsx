import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { buttonPressAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";

// Create a motion button component
const MotionButton = motion(Button);

// Get the Button props type from the Button component
type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export interface AnimatedButtonProps extends ButtonProps {
  animationVariant?: "press" | "pulse" | "scale" | "none";
  animationProps?: any;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    animationVariant = "press", 
    animationProps,
    ...props 
  }, ref) => {
    // Select animation variant
    const getAnimationVariant = () => {
      switch (animationVariant) {
        case "press":
          return buttonPressAnimation;
        case "none":
          return {};
        default:
          return buttonPressAnimation;
      }
    };

    return (
      <MotionButton
        ref={ref}
        className={cn(className)}
        {...props}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={getAnimationVariant()}
        {...animationProps}
      >
        {children}
      </MotionButton>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";