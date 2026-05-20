import React from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-500',
    primary: 'bg-primary-50 text-primary-600'
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
