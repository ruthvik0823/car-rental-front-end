import FilterCars from "@/components/FilterCars";
import FilteredCars from "@/components/FilteredCars";
import { useAppSelector } from "@/hooks/reduxStoreHooks";
import { useState } from "react";

const CarsPage = () => {
  const cars = useAppSelector((state) => state.cars.carsList);
  const carDetailsList = useAppSelector((state) => state.cars.carDetailsList);
  const [filteredCars, setFilteredCars] = useState(cars);
  return (
    <div className="flex flex-col gap-8 font-primary px-8">
      <h1 className="text-[27px] sm:text-4xl md:text-[56px] font-semibold px-1 md:px-2">
        Choose a car for rental
      </h1>
      <FilterCars
        cars={cars}
        carDetailsList={carDetailsList}
        setFilteredCars={setFilteredCars}
      ></FilterCars>
      <FilteredCars
        data={filteredCars}
        carDetailsList={carDetailsList}
      ></FilteredCars>
    </div>
  );
};

export default CarsPage;
