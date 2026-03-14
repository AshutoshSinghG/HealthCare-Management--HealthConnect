import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  animate = true,
  ...props
}) => {
  const Component = animate ? motion.div : 'div';
  const animateProps = animate ? {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  } : {};

  return (
    <Component
      className={`bg-white rounded-2xl border border-surface-200/60 shadow-card ${hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5' : ''} ${padding} ${className}`}
      {...animateProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
