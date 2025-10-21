import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


function Calendar({
  className,
  classNames,
  showOutsideDays,
  disabled,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  console.log(disabled)
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 rounded bg-[#FFFBF3]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-10",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1 ",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md "
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: "h-8 w-8 rounded-full cursor-pointer",
        day_range_start:
          "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white ",
        day_range_end:
          "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white",
        day_selected: "bg-[#F0F0F0] ",
        day_today: "bg-gray-200 text-black",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "  text-[#666666] text-[#666666]",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      disabled={disabled}
      {...props}
    />
  );
}

export { Calendar };
