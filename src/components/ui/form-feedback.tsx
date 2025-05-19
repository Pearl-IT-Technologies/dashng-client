import { errorShakeAnimation, fadeAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface FormFeedbackProps {
  type: "success" | "error" | "none";
  message?: string;
  className?: string;
  children?: ReactNode;
}

export function FormFeedback({
  type,
  message,
  className,
  children,
}: FormFeedbackProps) {
  if (type === "none") return null;

  return (
    <motion.div
      className={cn(
        "flex items-start gap-2 rounded-md p-3 text-sm",
        type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800",
        className
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={type === "error" ? errorShakeAnimation : fadeAnimation}
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1">
        {message && <p>{message}</p>}
        {children}
      </div>
    </motion.div>
  );
}