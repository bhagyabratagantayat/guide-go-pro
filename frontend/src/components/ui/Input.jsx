import React from 'react';

const Input = ({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  className = '',
  id
}) => {
  return (
    <div className={`relative group w-full ${className}`}>
      <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 text-text-secondary group-focus-within:text-primary">
        {Icon && <Icon className="size-5" />}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full pl-14 pr-6 py-4 
          glass rounded-[24px] 
          text-text-primary font-medium placeholder:text-text-secondary/50
          outline-none ring-0 focus:ring-2 focus:ring-primary/20 
          border-white/50 focus:border-primary/30
          transition-all duration-300
        "
      />
    </div>
  );
};

export default Input;
