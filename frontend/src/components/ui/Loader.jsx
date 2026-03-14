const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-surface-200 border-t-primary-600 rounded-full animate-spin ${className}`} />
  );
};

const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 w-48 rounded',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 rounded-2xl',
    rect: 'rounded-xl',
  };

  return (
    <div className={`bg-surface-200 animate-pulse ${variants[variant]} ${className}`} />
  );
};

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-surface-500 font-medium">Loading...</p>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-surface-200/60 shadow-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="avatar" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="title" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton variant="card" className="h-20" />
  </div>
);

export { Spinner, Skeleton, PageLoader, CardSkeleton };
export default Spinner;
