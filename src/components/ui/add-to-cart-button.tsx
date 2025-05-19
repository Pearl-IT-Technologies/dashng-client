import { addToCartAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface AddToCartButtonProps extends ButtonProps {
  onAddToCart: () => void;
  productId: number;
  className?: string;
}

export function AddToCartButton({
  onAddToCart,
  productId,
  className,
  children,
  ...props
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (isAdding || isAdded) return;
    
    setIsAdding(true);
    
    // Call the add to cart function
    onAddToCart();
    
    // After a short delay, show the success state
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      
      // Reset back to normal state after 1.5 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }, 600);
  };

  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      disabled={isAdding}
      {...props}
    >
      <motion.div
        className="flex items-center gap-2"
        initial="initial"
        animate={isAdding ? "animate" : "initial"}
        variants={addToCartAnimation}
      >
        {isAdded ? (
          <>
            <Check className="h-4 w-4" />
            <span>Added</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            {children || <span>Add to Cart</span>}
          </>
        )}
      </motion.div>
    </Button>
  );
}