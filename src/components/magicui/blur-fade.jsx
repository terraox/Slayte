import { useRef } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: inViewMargin });
  const isVisible = !inView || isInView;

  const directionOffset = direction === "down" ? offset : direction === "up" ? -offset : direction === "left" ? -offset : offset;
  const axis = direction === "left" || direction === "right" ? "x" : "y";

  const defaultVariants = {
    hidden: {
      [axis]: directionOffset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      filter: `blur(0px)`,
    },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
