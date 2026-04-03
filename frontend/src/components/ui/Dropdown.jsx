import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Dropdown = ({ options, value, onChange, placeholder = "Select option", label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1 opacity-50">{label}</p>}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white rounded-2xl py-4 px-6 flex items-center justify-between shadow-sm border-2 transition-all duration-300 ${
          isOpen ? 'border-primary ring-4 ring-primary/5' : 'border-slate-50'
        }`}
      >
        <span className={`font-bold ${selectedOption ? 'text-text-primary' : 'text-text-secondary'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-5 text-text-secondary transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white p-2 z-[3000] animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto no-scrollbar py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all mb-1 last:mb-0 ${
                  value === opt.value 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-text-secondary hover:bg-slate-50'
                }`}
              >
                {opt.label}
                {value === opt.value && <Check className="size-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
