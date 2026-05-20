import React from 'react'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={`
        rounded-full overflow-hidden bg-primary-100 flex items-center justify-center
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : name ? (
        <span className="text-primary-600 font-medium">{getInitials(name)}</span>
      ) : (
        <span className="text-primary-600">?</span>
      )}
    </div>
  )
}
