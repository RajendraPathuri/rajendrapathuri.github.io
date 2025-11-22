import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string;
    as?: React.ElementType;
}

export function GlitchText({ text, className, as: Component = 'span', ...props }: GlitchTextProps) {
    return (
        <Component className={cn("relative inline-block group", className)} {...props}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 animate-glitch translate-x-[2px]" aria-hidden="true">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-destructive opacity-0 group-hover:opacity-70 animate-glitch animation-delay-100 -translate-x-[2px]" aria-hidden="true">
                {text}
            </span>
        </Component>
    );
}
