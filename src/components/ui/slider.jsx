import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

/**
 * Single-thumb slider wrapper around Base UI's Slider.
 *
 * Props:
 *  value        – controlled value (number)
 *  defaultValue – uncontrolled starting value (number)
 *  min, max, step
 *  onValueChange(value: number) – called whenever the value changes
 *  onValueCommitted(value: number) – called when dragging ends
 */
function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onValueCommitted,
  ...props
}) {
  // Base UI passes a number back when value is a number, array when value is an array.
  // We always work with single numbers here.
  const handleChange = (val) => {
    if (!onValueChange) return;
    const num = Array.isArray(val) ? val[0] : val;
    onValueChange(num);
  };

  const handleCommit = (val) => {
    if (!onValueCommitted) return;
    const num = Array.isArray(val) ? val[0] : val;
    onValueCommitted(num);
  };

  // Controlled vs uncontrolled — never pass both.
  const controlled = value !== undefined ? { value } : {};
  const uncontrolled = value === undefined && defaultValue !== undefined ? { defaultValue } : {};

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      min={min}
      max={max}
      step={step}
      thumbAlignment="edge"
      {...controlled}
      {...uncontrolled}
      onValueChange={handleChange}
      onValueCommitted={handleCommit}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col py-1.5">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1 bg-white/[0.08] border border-white/[0.05]"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="select-none data-horizontal:h-full data-vertical:w-full rounded-full bg-linear-to-r from-[#7c3aed] to-[#5DCAA5]"
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          className="relative block size-3.5 shrink-0 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] ring-0 transition-transform select-none after:absolute after:-inset-3 hover:scale-110 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing active:scale-95"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider }
