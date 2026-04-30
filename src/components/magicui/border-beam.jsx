import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
  size = 80,
  duration = 8,
  delay = 0,
  colorFrom = "#7c3aed",
  colorTo = "#5DCAA5",
  borderWidth = 1.5,
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
    >
      {/* Top edge */}
      <motion.div
        className={cn("absolute top-0 h-[2px] rounded-full", className)}
        style={{
          width: size,
          background: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          filter: `blur(0.5px)`,
          boxShadow: `0 0 12px 2px ${colorFrom}40`,
        }}
        animate={{
          left: ['-10%', '110%'],
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Right edge */}
      <motion.div
        className={cn("absolute right-0 w-[2px] rounded-full", className)}
        style={{
          height: size,
          background: `linear-gradient(180deg, transparent, ${colorTo}, ${colorFrom}, transparent)`,
          filter: `blur(0.5px)`,
          boxShadow: `0 0 12px 2px ${colorTo}40`,
        }}
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: duration,
          delay: delay + duration * 0.25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Bottom edge */}
      <motion.div
        className={cn("absolute bottom-0 h-[2px] rounded-full", className)}
        style={{
          width: size,
          background: `linear-gradient(90deg, transparent, ${colorTo}, ${colorFrom}, transparent)`,
          filter: `blur(0.5px)`,
          boxShadow: `0 0 12px 2px ${colorFrom}40`,
        }}
        animate={{
          right: ['-10%', '110%'],
        }}
        transition={{
          duration: duration,
          delay: delay + duration * 0.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Left edge */}
      <motion.div
        className={cn("absolute left-0 w-[2px] rounded-full", className)}
        style={{
          height: size,
          background: `linear-gradient(180deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          filter: `blur(0.5px)`,
          boxShadow: `0 0 12px 2px ${colorTo}40`,
        }}
        animate={{
          bottom: ['-10%', '110%'],
        }}
        transition={{
          duration: duration,
          delay: delay + duration * 0.75,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
