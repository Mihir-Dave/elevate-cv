import React from 'react';
import './Input.css';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && <Icon className="input-icon" size={20} />}
        <input 
          className={`input-field ${Icon ? 'has-icon' : ''} ${error ? 'has-error' : ''}`}
          {...props} 
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
