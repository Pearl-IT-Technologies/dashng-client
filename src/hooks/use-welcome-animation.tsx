import { createContext, useState, useContext, ReactNode } from "react";

interface WelcomeAnimationContextType {
  showWelcomeAnimation: boolean;
  setShowWelcomeAnimation: (show: boolean) => void;
}

export const WelcomeAnimationContext = createContext<WelcomeAnimationContextType | null>(null);

export function WelcomeAnimationProvider({ children }: { children: ReactNode }) {
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  return (
    <WelcomeAnimationContext.Provider
      value={{
        showWelcomeAnimation,
        setShowWelcomeAnimation,
      }}
    >
      {children}
    </WelcomeAnimationContext.Provider>
  );
}

export function useWelcomeAnimation() {
  const context = useContext(WelcomeAnimationContext);
  if (!context) {
    throw new Error("useWelcomeAnimation must be used within a WelcomeAnimationProvider");
  }
  return context;
}