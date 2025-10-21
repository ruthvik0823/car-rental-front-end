import Dropdown from "./Dropdown";
import PriceSlider from "./PriceSlider";
import Button from "./common/Button";
import CommonDatePicker from "./common/CommonDatePicker";
import { DateRange } from "react-day-picker";

import { CarBriefInfo, CarDetails } from "@/types/types";
import { useEffect, useState } from "react";

interface FilterCarsProps {
  cars?: CarBriefInfo[];
  carDetailsList?: CarDetails[];
  setFilteredCars?: React.Dispatch<React.SetStateAction<CarBriefInfo[]>>;
}

const FilterCars = ({
  cars,
  carDetailsList,
  setFilteredCars,
}: FilterCarsProps) => {
  const [isPickUpLocationOpen, setIsPickUpLocationOpen] = useState(false);
  const [selectedPickUpLocationOption, setSelectedPickUpLocationOption] =
    useState("Choose location");
  const [isDropOffLocationOpen, setIsDropOffLocationOpen] = useState(false);
  const [selectedDropOffLocationOption, setSelectedDropOffLocationOption] =
    useState("Choose location");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isCarCategoryOpen, setIsCarCategoryOpen] = useState(false);
  const [selectedCarCategoryOption, setSelectedCarCategoryOption] =
    useState("Select");
  const [isGearboxOpen, setIsGearboxOpen] = useState(false);
  const [selectedGearboxOption, setSelectedGearboxOption] = useState("Select");
  const [isEngineTypeOpen, setIsEngineTypeOpen] = useState(false);
  const [selectedEngineTypeOption, setSelectedEngineTypeOption] =
    useState("Select");
  const [values, setValues] = useState([52, 400]);
  const range = [0, 1280];
  const handleClearFilters = () => {
    setErrors({
      pickUpLocation: false,
      dropOffLocation: false,
      date: false,
      carCategory: false,
      gearbox: false,
      engineType: false,
    });
    setSelectedPickUpLocationOption("Choose location");
    setSelectedDropOffLocationOption("Choose location");
    setSelectedCarCategoryOption("Select");
    setSelectedGearboxOption("Select");
    setSelectedEngineTypeOption("Select");
    setValues([52, 400]);
    setIsPickUpLocationOpen(false);
    setIsDropOffLocationOpen(false);
    setIsCarCategoryOpen(false);
    setIsGearboxOpen(false);
    setIsEngineTypeOpen(false);
    setDate(undefined);
  };

  const handleFilter = () => {
    const hasPickUpError = selectedPickUpLocationOption === "Choose location";
    const hasDropOffError = selectedDropOffLocationOption === "Choose location";
    const hasDateError = !date || !date.from || !date.to;
    const hasCarCategoryError =
      selectedCarCategoryOption === "Select" &&
      selectedCarCategoryOption !== "Select";
    const hasGearboxError =
      selectedGearboxOption === "Select" && selectedGearboxOption !== "Select";
    const hasEngineTypeError =
      selectedEngineTypeOption === "Select" &&
      selectedEngineTypeOption !== "Select";

    const hasErrors =
      hasPickUpError ||
      hasDropOffError ||
      hasDateError ||
      hasCarCategoryError ||
      hasGearboxError ||
      hasEngineTypeError;

    setErrors({
      pickUpLocation: hasPickUpError,
      dropOffLocation: hasDropOffError,
      date: hasDateError,
      carCategory: hasCarCategoryError,
      gearbox: hasGearboxError,
      engineType: hasEngineTypeError,
    });

    if (hasErrors) return;
    const arr = carDetailsList?.filter((carDetail) => {
      const matchesCategory =
        selectedCarCategoryOption === "Select" ||
        (carDetail.passengerCapacity === 6
          ? "Van"
          : carDetail.passengerCapacity === 5
          ? "SUV"
          : "Passenger car") === selectedCarCategoryOption;
      const matchesGearbox =
        selectedGearboxOption === "Select" ||
        carDetail.gearBoxType.toLowerCase() ===
          selectedGearboxOption.toLowerCase();
      const matchesEngine =
        selectedEngineTypeOption === "Select" ||
        carDetail.fuelType.toLowerCase() ===
          selectedEngineTypeOption.toLowerCase();

      const matchesPrice =
        carDetail.pricePerDay >= values[0] &&
        carDetail.pricePerDay <= values[1];

      return matchesCategory && matchesGearbox && matchesEngine && matchesPrice;
    });
    const filteredCarsArray = cars?.filter((car) =>
      arr?.some((carDetail) => carDetail.carId === car.carId)
    );
    setFilteredCars?.(filteredCarsArray || []);
  };

  const [errors, setErrors] = useState({
    pickUpLocation: false,
    dropOffLocation: false,
    date: false,
    carCategory: false,
    gearbox: false,
    engineType: false,
  });

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      pickUpLocation:
        prev.pickUpLocation &&
        selectedPickUpLocationOption !== "Choose location"
          ? false
          : prev.pickUpLocation,
      dropOffLocation:
        prev.dropOffLocation &&
        selectedDropOffLocationOption !== "Choose location"
          ? false
          : prev.dropOffLocation,
      date: prev.date && date?.from && date?.to ? false : prev.date,
      carCategory: prev.carCategory ? false : prev.carCategory,
      gearbox: prev.gearbox ? false : prev.gearbox,
      engineType: prev.engineType ? false : prev.engineType,
    }));
  }, [
    selectedPickUpLocationOption,
    selectedDropOffLocationOption,
    date,
    selectedCarCategoryOption,
    selectedGearboxOption,
    selectedEngineTypeOption,
  ]);

  return (
    <div className="border-1 border-black rounded-lg p-4 md:p-6">
      <form className="flex flex-col gap-4 md:gap-6">
        <div className="flex justify-end">
          <button
            className="text-primary hover:cursor-pointer text-sm md:text-base"
            onClick={handleClearFilters}
            type="button"
          >
            Clear all filters
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="w-full md:flex-1">
            <Dropdown
              title="Pick-up location"
              options={[
                "Choose location",
                "Ukraine, Kyiv",
                "Germany, Berlin",
                "USA, San Francisco",
                "France, Paris",
                "Italy, Rome",
              ]}
              isOpen={isPickUpLocationOpen}
              setIsOpen={setIsPickUpLocationOpen}
              selectedOption={selectedPickUpLocationOption}
              setSelectedOption={setSelectedPickUpLocationOption}
            ></Dropdown>
            {errors.pickUpLocation && (
              <p className="text-red-500 text-sm mt-1">
                Please select a pick-up location.
              </p>
            )}
          </div>
          <div className="w-full md:flex-1">
            <Dropdown
              title="Drop-off location"
              options={[
                "Choose location",
                "Ukraine, Kyiv",
                "Germany, Berlin",
                "USA, San Francisco",
                "France, Paris",
                "Italy, Rome",
              ]}
              isOpen={isDropOffLocationOpen}
              setIsOpen={setIsDropOffLocationOpen}
              selectedOption={selectedDropOffLocationOption}
              setSelectedOption={setSelectedDropOffLocationOption}
            ></Dropdown>
            {errors.dropOffLocation && (
              <p className="text-red-500 text-sm mt-1">
                Please select a drop-off location.
              </p>
            )}
          </div>
          <div className="w-full md:flex-1">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-row justify-between gap-2">
                <p className="mr-auto text-label">Pick-up date</p>
                <p className="mr-auto text-label">Drop-off date</p>
              </div>
              {/* <DatePickerWithRange className="w-full" /> */}
              <CommonDatePicker
                disablePrevDates={true}
                pickupdropoff={true}
                labels={false}
                date={date}
                setDate={setDate}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a valid date range.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-end">
          <div className="w-full md:flex-230">
            <Dropdown
              title="Car category"
              options={["Select", "Passenger car", "SUV", "Van"]}
              isOpen={isCarCategoryOpen}
              setIsOpen={setIsCarCategoryOpen}
              selectedOption={selectedCarCategoryOption}
              setSelectedOption={setSelectedCarCategoryOption}
            ></Dropdown>
            {errors.carCategory && (
              <p className="text-red-500 text-sm mt-1">
                Please select a car category.
              </p>
            )}
          </div>
          <div className="w-full md:flex-230">
            <Dropdown
              title="Gearbox"
              options={["Select", "Automatic", "Manual"]}
              isOpen={isGearboxOpen}
              setIsOpen={setIsGearboxOpen}
              selectedOption={selectedGearboxOption}
              setSelectedOption={setSelectedGearboxOption}
            ></Dropdown>
            {errors.gearbox && (
              <p className="text-red-500 text-sm mt-1">
                Please select a gearbox type.
              </p>
            )}
          </div>
          <div className="w-full md:flex-230">
            <Dropdown
              title="Type of engine"
              options={[
                "Select",
                "Gasoline",
                "Petrol",
                "Diesel",
                "Electric",
                "Hybrid",
              ]}
              isOpen={isEngineTypeOpen}
              setIsOpen={setIsEngineTypeOpen}
              selectedOption={selectedEngineTypeOption}
              setSelectedOption={setSelectedEngineTypeOption}
            ></Dropdown>
            {errors.engineType && (
              <p className="text-red-500 text-sm mt-1">
                Please select an engine type.
              </p>
            )}
          </div>
          <div className="w-full md:flex-302">
            <PriceSlider
              title="Price per day"
              values={values}
              setValues={setValues}
              range={range}
            ></PriceSlider>
          </div>
          <div className="w-full md:flex-240 mt-2 md:mt-0">
            <Button
              type="button"
              label="Find a car"
              fullWidth={true}
              onClick={handleFilter}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterCars;
