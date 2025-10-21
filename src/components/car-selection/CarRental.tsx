import { CarDetailsType } from "../../types/CarDetails";
import { CarGallery } from "./CarGallery";
import { CarDetails } from "./CarDetails";
import { FeedbackSection } from "./FeedbackSection";
import { AiOutlineClose } from "react-icons/ai";
import { ClientReview } from "@/types/types";

interface Props {
  carData: CarDetailsType;
  feedbackData: ClientReview[];
  BookingData?: {
    dropOffDateTime?: Date;
    dropOffLocationId?: string;
    pickupDateTime?: Date;
    pickupLocationId?: string;
  };
  handleCloseModal: () => void;
}

export const CarRental = ({
  carData,
  feedbackData,
  BookingData,
  handleCloseModal,
}: Props) => {
  if (!carData) return <></>;
  return (
    <div className="mt-10 pt-10 overflow-auto no-scrollbar absolute top-0 w-11/12 -translate-x-1/2 left-1/2 z-50 max-h-[120vh] h-[90vh]  bg-white rounded-lg shadow-lg">
      <div className="absolute right-5 top-4">
        <button onClick={handleCloseModal}>
          <AiOutlineClose />
        </button>
      </div>
      <div className="flex flex-col md:flex-row mx-6">
        {/* Left column with images */}
        <div className="w-full md:w-2/3 p-4">
          <CarGallery
            mainImage={carData.images[0]}
            thumbnails={carData.images}
            altText={carData.model}
          />
        </div>

        {/* Right column with details */}
        <div className="w-full my-4 md:w-1/3">
          <CarDetails car={carData} initialData={BookingData} />
        </div>
      </div>

      {/* Feedback Section */}
      <FeedbackSection feedbackItems={feedbackData} />
    </div>
  );
};
