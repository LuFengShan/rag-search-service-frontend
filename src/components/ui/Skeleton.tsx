import React from 'react'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = ''
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  return (
    <div
      className={`
        animate-pulse bg-gray-200
        ${variantStyles[variant]}
        ${className}
      `}
      style={{
        width: width || (variant === 'circular' ? height || 40 : '100%'),
        height: height || (variant === 'text' ? 16 : 40)
      }}
    />
  )
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={16} className="mb-2" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="rectangular" height={100} className="mb-4" />
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  )
}
