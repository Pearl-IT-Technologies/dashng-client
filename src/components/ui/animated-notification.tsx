import * as React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { attentionAnimation } from "@/lib/animation";

export type NotificationVariant = "success" | "error" | "warning" | "info";

export interface AnimatedNotificationProps {
  message: string;
  description?: string;
  variant?: NotificationVariant;
  onClose?: () => void;
  open?: boolean;
  className?: string;
  duration?: number;
  action?: React.ReactNode;
}

export function AnimatedNotification({
  message,
  description,
  variant = "info",
  onClose,
  open = true,
  className,
  duration = 5000,
  action,
}: AnimatedNotificationProps) {
  const [isVisible, setIsVisible] = React.useState(open);

  React.useEffect(() => {
    setIsVisible(open);
  }, [open]);

  React.useEffect(() => {
    if (isVisible && duration !== Infinity) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "rounded-lg border shadow-sm p-4 flex items-start",
            getBgColor(),
            className
          )}
        >
          <motion.div
            variants={attentionAnimation}
            initial="initial"
            animate="animate"
            className="flex-shrink-0 mr-3"
          >
            {getIcon()}
          </motion.div>
          <div className="flex-1">
            <h4 className="font-medium">{message}</h4>
            {description && (
              <p className="text-sm text-gray-700 mt-1">{description}</p>
            )}
            {action && <div className="mt-3">{action}</div>}
          </div>
          {onClose && (
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}