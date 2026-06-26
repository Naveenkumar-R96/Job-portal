const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'skeleton animate-pulse';
  if (variant === 'circle') return <div className={`${base} rounded-full ${className}`} />;
  if (variant === 'text') return <div className={`${base} h-4 rounded ${className}`} />;
  return <div className={`${base} rounded-xl ${className}`} />;
};

export const JobCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
    <div className="flex items-start gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6 rounded-lg" />
      <Skeleton className="w-20 h-6 rounded-lg" />
      <Skeleton className="w-14 h-6 rounded-lg" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton variant="text" className="w-24 h-5" />
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  </div>
);

export default Skeleton;
