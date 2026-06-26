const Input = ({ label, error, icon: Icon, className = '', ...rest }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-error focus:ring-error/20' : 'border-border'}`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
};

export default Input;
