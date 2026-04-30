import { cn } from "@/lib/utils"

/**
 * Custom Switch — fully self-contained, no external primitives.
 * Uses inline styles for thumb position + background so Tailwind JIT
 * scanning is never needed for critical state-driven values.
 */
function Switch({
  checked = false,
  onCheckedChange,
  checkedColor,
  disabled = false,
  className,
  size = "default",
  ...props
}) {
  const isSmall = size === "sm";
  const trackW = isSmall ? 28 : 36;
  const trackH = isSmall ? 16 : 20;
  const thumbSize = isSmall ? 10 : 14;
  const thumbOffset = 2; // gap from edge when unchecked
  const thumbTravel = trackW - thumbSize - thumbOffset * 2; // px to slide when checked

  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        width: trackW,
        height: trackH,
        backgroundColor: checked
          ? (checkedColor ?? "rgba(255,255,255,0.25)")
          : "rgba(255,255,255,0.05)",
        borderColor: checked
          ? (checkedColor ? `${checkedColor}55` : "rgba(255,255,255,0.2)")
          : "rgba(255,255,255,0.1)",
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: thumbOffset,
          width: thumbSize,
          height: thumbSize,
          borderRadius: "9999px",
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
          transform: `translate(${checked ? thumbTravel : 0}px, -50%)`,
          transition: "transform 0.2s ease",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

export { Switch }

