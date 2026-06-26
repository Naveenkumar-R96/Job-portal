const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-border-light p-5 transition-all duration-300 ${
        hover ? 'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer' : 'shadow-sm'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
