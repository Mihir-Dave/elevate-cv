import React from 'react';

// We rely on the global .glass-panel utility class from index.css
const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass-panel p-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
