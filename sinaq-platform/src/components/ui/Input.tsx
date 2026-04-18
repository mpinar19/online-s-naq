'use client';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-bold text-[#3D4F70] uppercase tracking-wider">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4F70]">{icon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-[#0D1120] border border-[rgba(99,120,255,0.2)] rounded-xl',
            'text-sm text-[#E8EEFF] placeholder:text-[#3D4F70]',
            'outline-none transition-all duration-150',
            'focus:border-[#6378FF] focus:shadow-[0_0_0_3px_rgba(99,120,255,0.1)]',
            icon && 'pl-10',
            error && 'border-[rgba(239,68,68,0.5)]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
export default Input;
