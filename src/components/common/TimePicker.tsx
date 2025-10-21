import { useState, useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";

// Create time slots at 30 min intervals in 12hr format
const generateTimeOptions = (): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 0 to 12 for 12 AM/PM
    return `${displayHour.toString().padStart(2, "0")}:00 ${ampm}`;
  });
};

const timeOptions = generateTimeOptions();

const timeStringToDate = (baseDate: Date, time: string): Date => {
  const [timePart, ampm] = time.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hour,
    minute
  );
};

interface TimePickerProps {
  label: string;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  options?: string[];
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  selectedTime,
  onTimeChange,
  options = timeOptions,
}) => {
  return (
    <div className="flex flex-col w-full max-w-xs p-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedTime}
        onChange={(e) => onTimeChange(e.target.value)}
      >
        {options.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

type DateProps =
  | {
      from: Date | undefined;
      to?: Date | undefined;
    }
  | undefined;

interface PickupDropoffProps {
  date?: DateProps;
  setDate:React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const PickupDropoff: React.FC<PickupDropoffProps> = ({ date,setDate }) => {
  const [pickupTime, setPickupTime] = useState("07:00 PM");
  const [dropoffTime, setDropoffTime] = useState("10:00 PM");




  // Convert time string like "07:00 PM" into Date with existing date
  const mergeTimeIntoDate = (baseDate: Date, timeString: string): Date => {
    const [time, modifier] = timeString.split(" ");
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const updated = new Date(baseDate);
    updated.setHours(hours);
    updated.setMinutes(minutes);
    updated.setSeconds(0);
    updated.setMilliseconds(0);
    return updated;
  };
  useEffect(() => {
    setDate(prev => {
      const from = prev?.from ? mergeTimeIntoDate(prev.from, pickupTime) : undefined;
      const to = prev?.to ? mergeTimeIntoDate(prev.to, dropoffTime) : undefined;
      return { from, to };
    });
  }, [pickupTime, dropoffTime]);


  const now = new Date();

  // Derive pickup and dropoff dates from prop, fallback to today
  const pickupDate = date?.from ?? now;
  const dropoffDate = date?.to ?? pickupDate;

  const isToday = (date: Date) => date.toDateString() === now.toDateString();

  const availablePickupOptions = useMemo(() => {
    if (isToday(pickupDate)) {
      return timeOptions.filter(
        (time) => timeStringToDate(pickupDate, time) > now
      );
    }
    return timeOptions;
  }, [pickupDate, now]);

  const availableDropoffOptions = useMemo(() => {
    if (pickupDate.toDateString() === dropoffDate.toDateString()) {
      const pickupIndex = timeOptions.indexOf(pickupTime);
      return timeOptions.slice(pickupIndex + 1);
    }
    return timeOptions;
  }, [pickupDate, dropoffDate, pickupTime]);

  useEffect(() => {
    if (!availablePickupOptions.includes(pickupTime)) {
      setPickupTime(availablePickupOptions[0]);
    }
  }, [availablePickupOptions]);

  useEffect(() => {
    if (!availableDropoffOptions.includes(dropoffTime)) {
      setDropoffTime(availableDropoffOptions[0]);
    }
  }, [availableDropoffOptions]);

  return (
    <div className="flex gap-4 shadow-md bg-[#FFFBF3] -mt-5  rounded-xl">
      <TimePicker
        label="Pick-up time"
        selectedTime={pickupTime}
        onTimeChange={setPickupTime}
        options={availablePickupOptions}
      />
      <TimePicker
        label="Drop-off time"
        selectedTime={dropoffTime}
        onTimeChange={setDropoffTime}
        options={availableDropoffOptions}
      />
    </div>
  );
};

export default PickupDropoff;
