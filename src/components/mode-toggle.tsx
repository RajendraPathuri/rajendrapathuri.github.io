"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newTheme = theme === "dark" ? "light" : "dark"

        // @ts-ignore - View Transitions API is not yet in all TS definitions
        if (!document.startViewTransition) {
            setTheme(newTheme)
            return
        }

        const x = e.clientX
        const y = e.clientY
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        )

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            setTheme(newTheme)
        })

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ]

            document.documentElement.animate(
                {
                    clipPath: theme === "dark" ? [...clipPath].reverse() : clipPath,
                },
                {
                    duration: 400,
                    easing: "ease-in",
                    pseudoElement: theme === "dark"
                        ? "::view-transition-old(root)"
                        : "::view-transition-new(root)",
                }
            )
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
