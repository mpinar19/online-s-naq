'use client';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
}

export default function Card({ className, glow, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#141B2D] border border-[rgba(99,120,255,0.15)] rounded-2xl',
        glow && 'shadow-[0_0_30px_rgba(99,120,255,0.08)]',
        hover && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-[rgba(99,120,255,0.3)] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 border-b border-[rgba(99,120,255,0.1)]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}
