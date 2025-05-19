import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// We'll use a direct query instead of the hook to avoid circular dependencies
const fetchUserSettings = async () => {
  try {
    const response = await apiRequest("GET", "/api/user-settings");
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    return null;
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get initial theme from localStorage or default to system
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('dash-theme') as Theme | null;
    return savedTheme || 'system';
  }
  return 'system';
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  
  // Fetch settings directly
  const { data: settings } = useQuery({
    queryKey: ['/api/user-settings'],
    queryFn: fetchUserSettings,
    retry: false,
    staleTime: 300000, // 5 minutes
  });

  // Initialize theme from settings when they load
  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings]);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Save theme choice to localStorage
    localStorage.setItem('dash-theme', theme);
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      
      // Listen for system changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Apply selected theme directly
      root.classList.add(theme);
    }
  }, [theme]);

  // Create a wrapped setTheme function that also updates localStorage
  const setThemeWithStorage = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('dash-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeWithStorage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}