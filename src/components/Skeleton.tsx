import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`bg-slate-200 animate-pulse rounded ${className}`}
        ></div>
      ))}
    </>
  );
};

export default Skeleton;