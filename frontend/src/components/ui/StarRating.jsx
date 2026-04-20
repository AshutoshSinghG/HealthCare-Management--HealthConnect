import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StarRating = ({ 
  rating, 
  setRating = null, 
  readonly = false, 
  size = "md",
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10"
  };

  const starClass = starSizes[size] || starSizes.md;

  const handleMouseEnter = (index) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(0);
  };

  const handleClick = (index) => {
    if (!readonly && setRating) setRating(index);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = (hoverRating || rating) >= index;
        return (
          <motion.div
            key={index}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            className={`${readonly ? '' : 'cursor-pointer'}`}
          >
            <Star
              className={`${starClass} transition-colors ${
                isFilled 
                  ? 'text-warning-500 fill-warning-500' 
                  : 'text-surface-200 fill-transparent'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;
