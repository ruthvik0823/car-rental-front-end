import { CarDetailsType } from "../../types/CarDetails";
import { useNavigate } from "react-router-dom";
import {
  TbManualGearbox as GearBoxIcon,
  TbEngine as EngineIcon,
  TbMan as ManIcon,
  TbBrandSpeedtest as SpeedIcon,
  TbCarFan as FanIcon,
} from "react-icons/tb";
import {
  FaGasPump as GasStationIcon,
  FaStar as RatingStarsIcon,
} from "react-icons/fa";
import DateRangePicker from "../common/CommonDatePicker";
import { addDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface CarDetailsProps {
  car: CarDetailsType;
  initialData?: {
    dropOffDateTime?: Date;
    pickupDateTime?: Date;
    pickupLocationId?: string;
    dropOffLocationId?: string;
  };
}

export const CarDetails = ({ car, initialData }: CarDetailsProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: initialData?.pickupDateTime ?? new Date("2025-10-01T10:00:00Z"),
    to:
      initialData?.dropOffDateTime ??
      addDays(new Date("2025-10-01T10:00:00Z"), 5),
  });

  const navigate = useNavigate();
  // console.log(date)
  const handleBooking = () => {
    navigate("/checkout", {
      state: {
        date,
        pickupLocationId: initialData?.pickupLocationId,
        dropOffLocationId: initialData?.dropOffLocationId,
        carId: car.carId,
      },
    });
  };

  return (
    <div className="w-full h-full p-4 bg-[#F0F0F0] rounded">
      <div className="flex justify-between items-start mb-2 border-b-1 border-[#DCDCDD] pb-3">
        <div>
          <h2 className=" font-normal  text-lg">{car.model}</h2>
          <p className=" text-[#666666]">{car.location}</p>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-1">{car.carRating}</span>
          <RatingStarsIcon className="text-yellow-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <GearBoxIcon />
          </div>
          <span className="ml-2 text-sm">
            {car.gearBoxType === "AUTOMATIC" ? "Automatic" : "Manual"}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <EngineIcon />
          </div>
          <span className="ml-2 text-sm">{car.engineCapacity}</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <GasStationIcon />
          </div>
          <span className="ml-2 text-sm">{car.fuelType}</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <ManIcon />
          </div>
          <span className="ml-2 text-sm">{car.passengerCapacity} seats</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <SpeedIcon />
          </div>
          <span className="ml-2 text-sm">{car.fuelConsumption}</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <FanIcon />
          </div>
          <span className="ml-2 text-sm">
            {car.climateControlOption !== "NONE"
              ? car.climateControlOption.replace(/_/g, " ").toLowerCase()
              : "No climate control"}
          </span>
        </div>
      </div>

      <DateRangePicker
        className="mt-2 flex border-1 border-black px-4 py-2 rounded-lg cursor-pointer"
        date={date}
        setDate={setDate}
      />

      <div className="md:mt-6 mt-2 ">
        <button
          disabled={car?.status !== "AVAILABLE"}
          className="px-4 w-full disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 py-3 rounded-full flex justify-center items-center transition-colors duration-300 font-medium focus:outline-none bg-red-600 text-white hover:bg-red-700"
          onClick={handleBooking}
        >
          {car?.status !== "AVAILABLE"
            ? "Currently Unavailable"
            : `Book $${car.pricePerDay} / day`}
        </button>
      </div>
    </div>
  );
};
