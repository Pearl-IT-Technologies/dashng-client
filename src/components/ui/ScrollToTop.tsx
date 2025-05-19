import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop component ensures that each page loads from the top 
 * by scrolling to the top of the page whenever the location changes.
 */
const ScrollToTop: React.FC = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default ScrollToTop;