"use client";

import * as React from "react";
import {  format } from "date-fns";
import { DateRange } from "react-day-picker";
// import TimePicker from 'react-time-picker';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PickupDropoff from "./TimePicker";
import { SlArrowDown } from "react-icons/sl";

type DatePickerWithRangeProps = {
  pickupdropoff?: boolean;
  labels?: boolean;
  date: DateRange | undefined;
  disablePrevDates? :boolean;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
} & React.HTMLAttributes<HTMLDivElement>;

export default function CommonDatePicker({
  className,
  labels = false,
  pickupdropoff = true,
  disablePrevDates = false,
  date,
  setDate
}: DatePickerWithRangeProps) {
  // console.log(date)
  return (
    <div className={cn("grid gap-2 cursor-pointer", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal rounded-none border-none bg-inherit shadow-none m-0 p-0 cursor-pointer",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex gap-6 w-full">
              <div className="w-1/2">
                {labels && (
                  <label className="block text-xs text-gray-500 mb-1">
                    Pick-up date
                  </label>
                )}
                <div className="flex items-center justify-between rounded-lg border border-gray-300 px-3 py-2.5">
                  <span className="text-gray-800 text-sm">
                    {date?.from
                      ? format(date.from, "LLLL dd")
                      :( labels
                      ? "Pick a date"
                      : "Pick-up date")}
                  </span>
                  <SlArrowDown className=" text-label" />
                </div>
              </div>
              <div className="w-1/2">
                {labels && (
                  <label className="block text-xs text-gray-500 mb-1">
                    Drop-off date
                  </label>
                )}
                <div className="flex items-center justify-between rounded-lg border border-gray-300 px-3 py-2.5">
                  <span className="text-gray-800 text-sm">
                    {date?.to
                      ? format(date.to, "LLLL dd")
                      : (labels
                      ? "Pick a date"
                      : "Drop-off date")}
                  </span>
                  <SlArrowDown className="text-label" />
                </div>
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white lg:mr-24 lg:mt-2 border-none"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            showOutsideDays={true}
            disabled={disablePrevDates ? { before: new Date() } : undefined}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          {pickupdropoff && <PickupDropoff date={date} setDate={setDate} />}
        </PopoverContent>
      </Popover>
    </div>
  );
}
