import { staggerContainer, staggerItem } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggeredList({ children, className, delay = 0 }: StaggeredListProps) {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      transition={{ delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function StaggeredItem({ children, className, index = 0 }: StaggeredItemProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerItem}
      custom={index}
    >
      {children}
    </motion.div>
  );
}