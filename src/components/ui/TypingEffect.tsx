"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypingEffectProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string;
    speed?: number;
    cursor?: boolean;
}

export function TypingEffect({ text, speed = 100, cursor = true, className, ...props }: TypingEffectProps) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return (
        <span className={cn("inline-block", className)} {...props}>
            {displayedText}
            {cursor && <span className="animate-blink border-r-2 border-primary ml-1">&nbsp;</span>}
        </span>
    );
}
