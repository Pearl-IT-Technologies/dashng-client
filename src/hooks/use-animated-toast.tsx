import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, AlertTriangle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNotification } from "@/components/ui/animated-notification";

export type AnimatedToastVariant = "default" | "success" | "error" | "warning" | "info";

interface UseAnimatedToastOptions {
  duration?: number;
  className?: string;
}

interface AnimatedToastProps {
  title: string;
  description?: string;
  variant?: AnimatedToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

export function useAnimatedToast(options: UseAnimatedToastOptions = {}) {
  const { duration = 5000, className } = options;
  const [toasts, setToasts] = React.useState<
    (AnimatedToastProps & { id: string; visible: boolean })[]
  >([]);

  const addToast = React.useCallback(
    ({ title, description, variant = "default", duration: toastDuration, action }: AnimatedToastProps) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id,
          title,
          description,
          variant,
          duration: toastDuration || duration,
          action,
          visible: true,
        },
      ]);

      // Auto-dismiss toast after duration
      setTimeout(() => {
        dismissToast(id);
      }, toastDuration || duration);

      return id;
    },
    [duration]
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, visible: false } : toast
      )
    );

    // Remove from state after animation completes
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const getIconByVariant = (variant: AnimatedToastVariant = "default") => {
    switch (variant) {
      case "success":
        return <Check className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBackgroundByVariant = (variant: AnimatedToastVariant = "default") => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const AnimatedToastContainer = React.useCallback(() => {
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id}>
              <AnimatedNotification
                message={toast.title}
                description={toast.description}
                variant={mapToNotificationVariant(toast.variant)}
                open={toast.visible}
                onClose={() => dismissToast(toast.id)}
                duration={toast.duration}
                action={toast.action}
                className={cn("max-w-sm", className)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    );
  }, [toasts, className, dismissToast]);
  
  // Helper function to map AnimatedToastVariant to NotificationVariant
  function mapToNotificationVariant(variant: AnimatedToastVariant = "default"): "success" | "error" | "warning" | "info" {
    switch (variant) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
      case "default":
      default:
        return "info";
    }
  }

  return {
    toast: addToast,
    dismissToast,
    AnimatedToastContainer,
  };
}