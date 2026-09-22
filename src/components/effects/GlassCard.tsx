import React, { useRef, useState } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'primary' | 'subtle';
  interactiveTilt?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactiveTilt = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 2-4px max tilt and translation (Section 29)
    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;
    const translateX = ((x - centerX) / centerX) * 2;
    const translateY = ((y - centerY) / centerY) * 2;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0)`,
      transition: 'transform 0.08s ease-out',
      '--card-mouse-x': `${x}px`,
      '--card-mouse-y': `${y}px`,
    } as React.CSSProperties);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const variantStyles = {
    default:
      'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]',
    accent:
      'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40 shadow-[0_8px_30px_rgba(16,185,129,0.06)]',
    primary:
      'bg-slate-900/90 text-white border-slate-700/80 shadow-[0_12px_40px_rgba(15,23,42,0.15)]',
    subtle:
      'bg-white/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 shadow-sm',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative rounded-2xl backdrop-blur-xl border transition-all duration-300 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Subtle liquid glass reflection gradient */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          background:
            'radial-gradient(400px circle at var(--card-mouse-x, 50%) var(--card-mouse-y, 50%), rgba(255,255,255,0.4), transparent 70%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
