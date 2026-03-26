import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = "relative font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-[20px] transition-all duration-300 btn-press flex items-center justify-center gap-2 overflow-hidden shadow-lg hover:shadow-xl active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "premium-gradient text-white shadow-indigo-200 hover:shadow-indigo-300",
    secondary: "bg-white text-primary border border-primary/10 hover:bg-surface shadow-sm",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "bg-transparent text-text-secondary hover:bg-surface hover:text-primary shadow-none",
    danger: "bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600",
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-10 py-5",
    icon: "p-3",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
