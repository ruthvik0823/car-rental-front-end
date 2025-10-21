import { useState } from "react";
import Card from "./common/Card";
import { LuArrowLeft, LuArrowRight, LuStar } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { CarBriefInfo } from "@/types/types";
import useScreenSize from "../hooks/useScreenSize";

const DisplayCars = ({ data }: { data: CarBriefInfo[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const screenSize = useScreenSize();

  // const filteredData = [displayCars];

  const carsPerPage = screenSize === "lg" ? 16 : screenSize === "sm" ? 12 : 8;

  // const totalPages = 1;
  const totalPages = data.length ? Math.ceil(data.length / carsPerPage) : 1;

  const handleSeeMoreDetails = (carId: string) => {
    navigate(`/cars/${carId}`);
  };

  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = data.slice(startIndex, endIndex);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-2">
        {currentCars.map((item) => (
          <Card
            key={item.carId}
            className="flex flex-col p-4 bg-background-primary "
          >
            <div className="space-y-2 ">
              <figure className="relative flex flex-col flex-200">
                <img src={item.imageUrl} className="rounded-sm"></img>
                <div className="absolute top-0 left-0 rounded-sm bg-white py-1 px-2 text-[10px] sm:text-xs lg:text-sm">
                  {item.status}
                </div>
              </figure>
              <div className="flex flex-col flex-156">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] md:text-sm">{item.model}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] md:text-sm">{item.carRating}</p>
                    <LuStar className="w-3 h-3 text-rating"></LuStar>
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-label">
                  {item.location}
                </p>
                <button className="border border-black p-1 md:p-2 rounded-full font-medium my-4 text-[10px] sm:text-xs md:text-[13px] lg:text-sm">
                  Book the car - ${item.pricePerDay}/day
                </button>
                <button
                  onClick={() => handleSeeMoreDetails(item.carId)}
                  className="flex justify-center underline hover:cursor-pointer text-[10px] md:text-base"
                >
                  See more details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center my-10 gap-6">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              className="w-10 h-10 border rounded-full text-sm font-semibold flex justify-center items-center"
            >
              <LuArrowLeft />
            </button>
          )}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 border rounded-full text-sm font-semibold flex justify-center items-center ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "border-black text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="w-10 h-10 border rounded-full text-sm font-semibold flex justify-center items-center"
            >
              <LuArrowRight />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayCars;
