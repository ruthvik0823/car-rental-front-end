"use client";

import { DualRangeSlider } from "@/components/ui/dual-range-slider";

const PriceSlider = ({
  title,
  values,
  setValues,
  range,
}: {
  title: string;
  values: number[];
  setValues: (values: number[]) => void;
  range: number[];
}) => {
  return (
    <div className="w-full space-y-2 mb-3 hover:cursor-pointer">
      <div className="flex justify-between items-center">
        <label className="text-label">{title}</label>
        <span className="text-sm ">
          ${values[0]} - ${values[1]}
        </span>
      </div>

      {/* Slider Section */}
      <DualRangeSlider
        value={values}
        onValueChange={(newValues: number[]) => {
          const [minValue, maxValue] = newValues;
          if (minValue > maxValue) {
            setValues([maxValue, maxValue]);
          } else {
            setValues(newValues);
          }
        }}
        min={range[0]}
        max={range[1]}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default PriceSlider;
