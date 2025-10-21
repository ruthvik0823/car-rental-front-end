import RatingStars from "./common/RatingStars";
import { FeedbackInfo } from "@/types/types";

const RecentFeedbackCard = ({ data }: { data: FeedbackInfo }) => {
  return (
    <div className="flex flex-col gap-2 md:gap-4 p-3 md:p-4 rounded-lg border border-black h-[420px] sm:h-[450px] lg:h-[480px]">
      <figure className="flex-3">
        <img src={data.carImageUrl} className="rounded-sm w-full h-full"></img>
      </figure>
      <div className="flex-7 flex flex-col justify-around gap-2 md:gap-3">
        <h1 className="text-md md:text-lg lg:text-xl">{data.carModel}</h1>
        <p className="text-xs md:text-[13px] lg:text-sm text-label">
          Order history: {data.orderHistory}
        </p>
        <RatingStars value={data.rating}></RatingStars>
        <p className="text-xs md:text-[13px] lg:text-sm line-clamp-3">
          {data.feedbackText}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-[13px] lg:text-sm">
            <span>{data.author},</span>
            <span className="text-label">{data.location}</span>
          </p>
          <p className="text-xs md:text-[13px] lg:text-sm text-label">
            {data.date}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentFeedbackCard;
