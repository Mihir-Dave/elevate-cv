import React from 'react';

const Section = ({ title, description, children, className = '' }) => {
  return (
    <section className={`flex flex-col space-y-6 ${className}`}>
      {(title || description) && (
        <div className="flex flex-col space-y-2">
          {title && <h2 className="text-2xl font-bold font-outfit tracking-tight text-white">{title}</h2>}
          {description && <p className="text-slate-400 text-base">{description}</p>}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
};

export default Section;
