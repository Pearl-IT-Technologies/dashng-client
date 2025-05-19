import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ColorCustomizationPreviewProps {
  productName: string;
  images: string[];
  colors: string[];
  colorHexMap: Record<string, string>;
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
  currentStock: number;
}

const ColorCustomizationPreview: React.FC<ColorCustomizationPreviewProps> = ({
  productName,
  images,
  colors,
  colorHexMap,
  selectedColor,
  onColorSelect,
  currentStock
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<Record<string, string[]>>(
    {default: images}
  );
  
  // If we don't have at least two colors, just use the default images
  const canCustomize = colors && colors.length > 1;
  
  // This effect would ideally fetch color-specific images from the API
  // For now, we'll simulate color variations using CSS filters
  useEffect(() => {
    if (selectedColor && canCustomize) {
      setIsPreviewLoading(true);
      
      // In a real implementation, you would fetch real product images based on color
      // Here we're simulating a delay to show the loading state
      const timer = setTimeout(() => {
        setIsPreviewLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedColor, canCustomize]);

  // Helper function to get image styles based on selected color
  const getImageStyles = (color: string | null) => {
    if (!color || color === 'Default' || color === 'White' || color === 'Black') {
      return {};
    }
    
    // Apply a subtle color filter based on the selected color
    // This is a simple simulation - in production you'd use actual product images
    const hexColor = colorHexMap[color] || color;
    return {
      filter: `sepia(30%) hue-rotate(${getHueRotation(hexColor)}deg) saturate(${getSaturation(hexColor)}%) brightness(${getBrightness(hexColor)}%)`,
    };
  };
  
  // Helper functions to calculate filter values based on color
  const getHueRotation = (hexColor: string): number => {
    // Simple hue rotation calculation based on hex color
    // This is a naive implementation - would be more sophisticated in production
    if (hexColor.startsWith('#')) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      return ((r + g * 2 + b * 3) % 360);
    }
    return 0;
  };
  
  const getSaturation = (hexColor: string): number => {
    // Simple saturation calculation
    if (hexColor.startsWith('#')) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // Calculate color intensity
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      
      // Return a value between 70 and 130
      return delta === 0 ? 100 : 70 + (delta / 255) * 60;
    }
    return 100;
  };
  
  const getBrightness = (hexColor: string): number => {
    // Simple brightness calculation
    if (hexColor.startsWith('#')) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // Calculate perceived brightness
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // Return a value between It's #2c2c2c!80 and 120
      return 80 + (brightness / 255) * 40;
    }
    return 100;
  };

  return (
    <div className="space-y-4">
      {/* Main image with color preview */}
      <div className="relative rounded-lg overflow-hidden aspect-square border border-gray-200">
        {isPreviewLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
            <span className="ml-2 text-sm text-gray-500">Loading {selectedColor} preview...</span>
          </div>
        ) : (
          <>
            <img
              src={images[activeImageIndex]}
              alt={`${productName} in ${selectedColor || 'default'} color`}
              className="w-full h-full object-cover transition-all duration-500"
              style={getImageStyles(selectedColor)}
            />
            {currentStock <= 10 && currentStock > 0 && (
              <div className={`absolute top-4 right-4 text-white text-xs px-3 py-1 z-10 rounded-full shadow-md 
                ${currentStock <= 3 ? 'bg-red-600' : 'bg-orange-500'}`}
              >
                Only {currentStock} left
              </div>
            )}
            {currentStock === 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 z-10 rounded-full shadow-md">
                Out of Stock
              </div>
            )}
          </>
        )}
      </div>

      {/* Image thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square border-2 rounded-md overflow-hidden ${
                activeImageIndex === index
                  ? "border-[#D4AF37] shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
                style={getImageStyles(selectedColor)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Color selector with preview indicators */}
      {canCustomize && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Preview in Different Colors</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                className={`relative group rounded-md overflow-hidden ${
                  selectedColor === color ? 'ring-2 ring-[#D4AF37] ring-offset-2' : 'ring-1 ring-gray-200'
                }`}
                onClick={() => onColorSelect(color)}
                aria-label={`View in ${color}`}
              >
                <div 
                  className="w-16 h-16 relative"
                  style={{backgroundColor: colorHexMap[color] || color}}
                >
                  <img 
                    src={images[0]} 
                    alt={`${productName} in ${color}`}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 
                    ${selectedColor === color ? 'bg-opacity-20' : 'group-hover:bg-opacity-10'}`}>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-1 text-center truncate">
                  {color}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Preview is a simulation. Actual product color may vary slightly.
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorCustomizationPreview;