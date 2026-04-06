import React from 'react';

const Input = React.forwardRef(({ label, icon: Icon, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-500" />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-900/50 border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'} text-slate-100 rounded-xl ${Icon ? 'pl-11' : 'px-4'} py-3 outline-none transition-all duration-300 focus:ring-4 placeholder-slate-500 shadow-inner ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-semibold text-red-400">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
