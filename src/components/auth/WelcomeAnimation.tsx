import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../schema";
import { useWelcomeAnimation } from "@/hooks/use-welcome-animation";
import dashLogo from "@/assets/dash-logo-new.png";

interface WelcomeAnimationProps {
  user: User | null;
  onComplete?: () => void;
}

const WelcomeAnimation = ({ user, onComplete }: WelcomeAnimationProps) => {
  const { showWelcomeAnimation, setShowWelcomeAnimation } = useWelcomeAnimation();
  const [phase, setPhase] = useState<"initial" | "text" | "complete">("initial");
  
  useEffect(() => {
    // Reset phase when the animation should be shown
    if (showWelcomeAnimation) {
      setPhase("initial");
      
      // Initial animation delay
      const initialTimer = setTimeout(() => {
        setPhase("text");
      }, 1000);
      
      // Auto-complete animation after 4 seconds
      const completeTimer = setTimeout(() => {
        setPhase("complete");
        
        // Give a bit more time before hiding the animation completely
        setTimeout(() => {
          setShowWelcomeAnimation(false);
          if (onComplete) onComplete();
        }, 800);
      }, 4000);
      
      return () => {
        clearTimeout(initialTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [showWelcomeAnimation, setShowWelcomeAnimation, onComplete]);
  
  if (!showWelcomeAnimation || !user) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {showWelcomeAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Logo animation */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: phase === "initial" ? 1 : phase === "text" ? 0.8 : 0.6, 
              opacity: 1,
              y: phase === "initial" ? 0 : phase === "text" ? -50 : -80
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, 0, -2, 0] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <img 
                  src={dashLogo} 
                  alt="DASH Logo" 
                  className="h-32 md:h-40 w-auto" 
                />
              </motion.div>
              
              {/* Decorative underline */}
              <motion.div 
                className="w-3/4 h-0.5 bg-[#D4AF37] mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </div>
          </motion.div>
          
          {/* Welcome text */}
          <AnimatePresence>
            {phase === "text" && (
              <motion.div 
                className="absolute text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 30 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-serif mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome
                  {user.firstName ? `, ${user.firstName}` : ''}
                </motion.div>
                <motion.div 
                  className="text-gray-300 max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Your luxury fashion journey begins here
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Golden decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top right corner decoration */}
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 opacity-20"
              initial={{ opacity: 0, x: 50, y: -50 }}
              animate={{ opacity: 0.15, x: 0, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="w-full h-full border-t-2 border-r-2 border-[#D4AF37]" />
            </motion.div>
            
            {/* Bottom left corner decoration */}
            <motion.div 
              className="absolute bottom-0 left-0 w-64 h-64 opacity-20"
              initial={{ opacity: 0, x: -50, y: 50 }}
              animate={{ opacity: 0.15, x: 0, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="w-full h-full border-b-2 border-l-2 border-[#D4AF37]" />
            </motion.div>
            
            {/* Animated particles - gold dots */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#D4AF37]"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 0],
                  scale: [0, 1, 0],
                  y: [0, Math.random() * -100 - 50]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Skip button */}
          <motion.button
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white text-sm underline"
            onClick={() => {
              setPhase("complete");
              setTimeout(() => {
                setShowWelcomeAnimation(false);
                if (onComplete) onComplete();
              }, 500);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Skip Animation
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAnimation;