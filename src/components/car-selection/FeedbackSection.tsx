import { useMemo, useState } from "react";
import { RatingStars } from "./RatingStars";
import { Pagination } from "./Pagination";
import Dropdown from "../Dropdown";
import { ClientReview } from "@/types/types";
interface FeedbackItemProps {
  feedback: ClientReview;
}

const getRatingFromRentalExperience = (rentalExperience: string) => {
  const match = rentalExperience.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

const FeedbackItem = ({ feedback }: FeedbackItemProps) => {
  return (
    <div className="flex border-t border-gray-300 pt-4 space-x-4 ">
      <div className="flex flex-col md:flex-row items-center gap-1 md:min-w-[120px] ">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <img
            src={feedback.authorImageUrl}
            alt={feedback.author}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-800 break-all w-14">
          {feedback.author}
        </span>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="mt-1">
          <RatingStars
            rating={getRatingFromRentalExperience(feedback.rentalExperience)}
            size={14}
          />
        </div>
        <p className="mt-2 text-sm font-normal break-words text-gray-800">
          {feedback.text}
        </p>
      </div>
      <span className="text-sm font-normal text-gray-500 whitespace-nowrap ml-auto">
        {feedback.date}
      </span>
    </div>
  );
};

interface FeedbackSectionProps {
  feedbackItems: ClientReview[];
}

export const FeedbackSection = ({ feedbackItems }: FeedbackSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [isOpen, setIsOpen] = useState(false);
  const itemsPerPage = 3;
  const sortOptions = [
    { label: "The newest", value: "newest" },
    { label: "The oldest", value: "oldest" },
    { label: "Rating: low to high", value: "rating-low" },
    { label: "Rating: high to low", value: "rating-high" },
  ];

  const totalPages = Math.ceil(feedbackItems.length / itemsPerPage);
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const sortedFeedback = useMemo(() => {
    const sorted = [...feedbackItems];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
        );

      case "rating-low":
        return sorted.sort((a, b) => {
          const ratingA =
            getRatingFromRentalExperience(a.rentalExperience) || 0;
          const ratingB =
            getRatingFromRentalExperience(b.rentalExperience) || 0;
          return ratingA - ratingB;
        });
      case "rating-high":
        return sorted.sort((a, b) => {
          const ratingA =
            getRatingFromRentalExperience(a.rentalExperience) || 0;
          const ratingB =
            getRatingFromRentalExperience(b.rentalExperience) || 0;
          return ratingB - ratingA;
        });
      default:
        return sorted;
    }
  }, [feedbackItems, sortBy]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleFeedback = sortedFeedback.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="border-t border-gray-200 p-4 mx-8 bg-[#F0F0F0] mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-normal">Feedback</h3>
        <div className="flex items-center text-sm">
          <span className="mr-2 font-normal text-sm text-[#666666]">
            Sort by:
          </span>
          <div className="relative w-48">
            <Dropdown
              title=""
              options={sortOptions.map((opt) => opt.label)}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedOption={
                sortOptions.find((opt) => opt.value === sortBy)?.label || ""
              }
              setSelectedOption={(label) => {
                const selected = sortOptions.find((opt) => opt.label === label);
                if (selected) {
                  setSortBy(selected.value);
                  setCurrentPage(1);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {visibleFeedback.map((item) => (
          <FeedbackItem key={item.author} feedback={item} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
