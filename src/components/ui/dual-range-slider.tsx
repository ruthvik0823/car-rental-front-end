"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => React.ReactNode;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = "top", ...props }, ref) => {
  const initialValue = Array.isArray(props.value)
    ? props.value
    : [props.min, props.max];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="flex items-center relative h-1 w-full grow overflow-hidden rounded-full bg-sliderTrack">
        <SliderPrimitive.Range className="absolute h-1 bg-primary" />
      </SliderPrimitive.Track>
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb className="relative block h-2 w-1 rounded-sm bg-primary focus:outline-none">
            {label && (
              <span
                className={cn(
                  "absolute flex w-full justify-center",
                  labelPosition === "top" && "-top-7",
                  labelPosition === "bottom" && "top-4"
                )}
              >
                {label(value)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
