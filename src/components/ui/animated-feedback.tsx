import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple wrapper for page animations
export const AnimationWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type FeedbackType = 'success' | 'error' | 'info';

interface AnimatedFeedbackProps {
  message: string;
  type?: FeedbackType;
  duration?: number;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  onComplete?: () => void;
}

export const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({
  message,
  type = 'success',
  duration = 2000,
  className = '',
  position = 'top-right',
  onComplete
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Define position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  // Define type-specific settings
  const feedbackConfig = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-300',
      borderColor: 'border-green-500 dark:border-green-800'
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-300',
      borderColor: 'border-red-500 dark:border-red-800'
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-300',
      borderColor: 'border-blue-500 dark:border-blue-800'
    }
  };

  const config = feedbackConfig[type];

  // Handle animation complete
  const handleAnimationComplete = () => {
    if (!visible && onComplete) {
      onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed z-50 flex items-center p-3 rounded-md border shadow-md',
            config.bgColor,
            config.textColor,
            config.borderColor,
            positionClasses[position],
            className
          )}
        >
          <div className="mr-2">{config.icon}</div>
          <div className="text-sm font-medium">{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedFeedback;

// Button hover animation component
interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 
    'default' | 
    'destructive' | 
    'outline' | 
    'secondary' | 
    'ghost' | 
    'link';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'default'
}) => {
  // Different variants with appropriate hover states
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
};

// Card hover animation
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({
  children,
  className,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-all',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// List item animation for staggered animations
// Using div instead of tr to avoid DOM nesting issues
export const AnimatedListItem = React.forwardRef<
  HTMLDivElement, 
  {
    children: React.ReactNode;
    index: number;
    className?: string;
  }
>(({ children, index, className }, ref) => {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        animation: `fadeIn 0.3s ease-out forwards ${index * 0.05}s`
      }}
    >
      {children}
    </div>
  );
});

// Form input animation for focus states
export const AnimatedInput: React.FC<{
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
}> = ({
  className,
  placeholder,
  value,
  onChange,
  type = "text",
  id,
  name,
  disabled,
  required
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          'rounded-md transition-all duration-200',
          isFocused ? 'ring-2 ring-primary/20' : ''
        )}
      >
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        />
      </div>
    </div>
  );
};

// Button click animation
export const ClickAnimation: React.FC<{
  x: number;
  y: number;
  onComplete: () => void;
}> = ({ x, y, onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0, x, y, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 0 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute w-12 h-12 rounded-full bg-primary/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      onAnimationComplete={onComplete}
    />
  );
};

export const useClickAnimation = () => {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const addClick = (x: number, y: number) => {
    const id = Date.now();
    setClicks(prev => [...prev, { id, x, y }]);
  };

  const removeClick = (id: number) => {
    setClicks(prev => prev.filter(click => click.id !== id));
  };

  return {
    clicks,
    addClick,
    removeClick,
    ClickAnimationWrapper: ({ children }: { children: React.ReactNode }) => (
      <div className="relative overflow-hidden" onClick={(e) => addClick(e.clientX, e.clientY)}>
        {children}
        {clicks.map(click => (
          <ClickAnimation 
            key={click.id}
            x={click.x}
            y={click.y}
            onComplete={() => removeClick(click.id)}
          />
        ))}
      </div>
    )
  };
};