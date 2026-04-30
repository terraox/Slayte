import React from "react";
import { cn } from "@/lib/utils";

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}) {
  return (
    <span
      className={cn(
        "inline animate-gradient bg-gradient-to-r bg-[length:300%_100%] bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        animationDuration: `${3 / speed}s`,
      }}
    >
      {children}
    </span>
  );
}
