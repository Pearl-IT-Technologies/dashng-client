import * as React from "react";
import { inputFocusAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input, InputProps } from "@/components/ui/input";

const MotionInput = motion(Input);

export interface AnimatedInputProps extends InputProps {
  label?: string;
  error?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            className="block text-sm font-medium"
            initial={{ y: 0 }}
            animate={{ 
              y: isFocused ? -2 : 0, 
              color: isFocused ? "var(--primary)" : "var(--foreground)" 
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        <MotionInput
          type={type}
          className={cn(
            error ? "border-red-500 focus:ring-red-500" : "focus:ring-primary",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          initial="initial"
          animate={isFocused ? "focus" : "initial"}
          variants={inputFocusAnimation}
          {...props}
        />
        {error && (
          <motion.p
            className="text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };