import Card from "./common/Card";
import { LuStar } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Car } from "@/types/types";

type PopularCarsProps = {
  data: Car[];
};

const PopularCars = ({ data }: PopularCarsProps) => {
  const navigate = useNavigate();
  const topCars = [...data]
    .sort((a, b) => parseFloat(b.carRating) - parseFloat(a.carRating))
    .slice(0, 4);
  const handleSeeMoreDetails = (carId: string) => {
    navigate(`/cars/${carId}`, { replace: false });
    window.scrollTo(0, 0); // Scroll to top when navigating
  };

  return (
    <div>
      <div className="flex-1 text-label text-xl font-medium mb-6">
        (POPULAR CARS)
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-6 gap-2">
        {topCars.map((item) => (
          <Card
            key={item.carId}
            className="flex flex-col w-full p-4 bg-background-primary"
          >
            <div className="space-y-2">
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
                <button
                  onClick={() => handleSeeMoreDetails(item.carId)}
                  disabled={item.status !== "AVAILABLE"}
                  className="border disabled:cursor-not-allowed border-black cursor-pointer disabled:border-gray-300 disabled:text-gray-300 disabled:font-bold p-1 md:p-2 rounded-full font-medium my-4 text-[10px] sm:text-xs md:text-[13px] lg:text-sm"
                >
                  Book the car - ${item.pricePerDay}/day
                </button>
                <button
                  onClick={() => handleSeeMoreDetails(item.carId)}
                  className="flex justify-center underline hover:cursor-pointer text-[10px] md:text-base "
                >
                  See more details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-row-reverse mt-10">
        <button
          onClick={() => navigate("/cars")}
          className="font-semibold underline hover:cursor-pointer text-sm md:text-base"
        >
          View all cars
        </button>
      </div>
    </div>
  );
};

export default PopularCars;
