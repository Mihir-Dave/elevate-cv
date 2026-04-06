import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg ${
        hover ? 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
