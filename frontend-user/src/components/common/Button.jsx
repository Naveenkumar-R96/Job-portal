import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5',
  secondary: 'border border-border text-text-secondary hover:text-text-primary hover:bg-gray-50',
  outline: 'border border-primary text-primary hover:bg-primary-50',
  ghost: 'text-text-secondary hover:text-primary hover:bg-primary-50',
  danger: 'bg-error text-white hover:bg-red-600',
  white: 'bg-white text-primary hover:bg-primary-50 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  outlineWhite: 'border border-white/30 text-white hover:bg-white/10 hover:border-white hover:-translate-y-0.5',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-2xl',
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, loading, ...rest }) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
