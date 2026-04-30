import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const generateStar = (color) => ({
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
  createdAt: Date.now(),
  color,
  size: random(10, 20),
  style: {
    top: random(0, 100) + "%",
    left: random(0, 100) + "%",
    zIndex: 2,
  },
});

const STAR_SVG = (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z" />
  </svg>
);

export function SparklesText({
  children,
  className,
  sparklesCount = 10,
  colors = { first: "#A07CFE", second: "#FE8FB5" },
  ...props
}) {
  const [sparkles, setSparkles] = useState([]);
  const intervalRef = useRef(null);

  const updateSparkles = useCallback(() => {
    const now = Date.now();
    const color = now % 2 === 0 ? colors.first : colors.second;
    const newStar = generateStar(color);
    const filteredSparkles = sparkles.filter(
      (s) => now - s.createdAt < 750
    );
    filteredSparkles.push(newStar);
    setSparkles(filteredSparkles);
  }, [colors.first, colors.second, sparkles]);

  useEffect(() => {
    intervalRef.current = setInterval(updateSparkles, 400);
    return () => clearInterval(intervalRef.current);
  }, [updateSparkles]);

  return (
    <span
      className={cn("relative inline-block font-bold", className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <AnimatePresence mode="popLayout">
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="pointer-events-none absolute z-20 inline-block"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              ...sparkle.style,
              width: sparkle.size,
              height: sparkle.size,
              color: sparkle.color,
              fill: sparkle.color,
            }}
          >
            <svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                fill="currentColor"
              />
            </svg>
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
