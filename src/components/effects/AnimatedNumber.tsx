import React, { useEffect, useState, useRef } from 'react';
import { formatCurrencyINR } from '../../engine/calculations';

interface AnimatedNumberProps {
  value: number | null;
  decimals?: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 2,
  isCurrency = true,
  prefix = '',
  suffix = '',
  duration = 500,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 0);
  const previousValueRef = useRef<number>(value ?? 0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const targetValue = value ?? 0;
    const startValue = previousValueRef.current;
    previousValueRef.current = targetValue;

    if (startValue === targetValue) {
      setDisplayValue(targetValue);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className={className}>—</span>;
  }

  const formatted = isCurrency
    ? formatCurrencyINR(displayValue, decimals)
    : `${prefix}${displayValue.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

  return (
    <span className={`tabular-nums ${className}`} aria-live="polite">
      {formatted}
    </span>
  );
};
