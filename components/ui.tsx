import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }> = ({ 
  className = '', 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md',
    secondary: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
    outline: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50',
    ghost: 'text-amber-700 hover:bg-amber-100/50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100'
  };

  return (
    <button 
      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-amber-100 text-amber-800' }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${color}`}>
    {children}
  </span>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-4 py-2 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all ${className}`}
    {...props}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea 
    className={`w-full px-4 py-2 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all min-h-[100px] ${className}`}
    {...props}
  />
);

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden ${className}`}>
    {children}
  </div>
);