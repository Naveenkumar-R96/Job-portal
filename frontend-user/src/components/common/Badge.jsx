const colorMap = {
  purple: 'bg-primary-50 text-primary',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
  gray: 'bg-gray-100 text-text-secondary',
};

const Badge = ({ children, color = 'purple', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
