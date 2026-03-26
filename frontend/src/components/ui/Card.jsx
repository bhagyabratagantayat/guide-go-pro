import React from 'react';

const Card = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        glass rounded-[32px] p-6 
        ${hover ? 'hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
