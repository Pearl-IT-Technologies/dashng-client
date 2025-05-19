import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SuccessAnimationProps {
  trigger: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SuccessAnimation({
  trigger,
  className,
  children,
}: SuccessAnimationProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-16 w-16 bg-white rounded-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <svg
                className="text-green-500 h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.3 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}