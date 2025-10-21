// RecentFeedback.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useState, useEffect, useRef } from "react";
import RecentFeedbackCard from "./RecentFeedbackCard";
import { LuMoveRight } from "react-icons/lu";
import { LuMoveLeft } from "react-icons/lu";
import { Swiper as SwiperType } from "swiper/types";
import { FeedbackInfo } from "@/types/types";

const RecentFeedback = ({ feedbacks }: { feedbacks: FeedbackInfo[] }) => {
  const [data, setData] = useState<FeedbackInfo[]>(feedbacks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType>(null);

  const handleSlideNext = () => swiperRef.current?.slideNext();
  const handleSlidePrev = () => swiperRef.current?.slidePrev();

  useEffect(() => {
    setData(feedbacks);
    setLoading(false);
  }, [feedbacks.length]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-3xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-3xl">
        {error}
      </div>
    );

  return (
    <div className="group mt-20">
      <div className="flex-1 text-label text-lg sm:text-xl lg:text-2xl font-medium mb-6">
        (RECENT FEEDBACK)
      </div>
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        modules={[Navigation]}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {data.map((item) => (
          <SwiperSlide key={item?.feedbackId}>
            <RecentFeedbackCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="flex flex-row-reverse gap-5 mt-4">
        <button
          onClick={handleSlideNext}
          disabled={isEnd}
          className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <LuMoveRight className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={handleSlidePrev}
          disabled={isBeginning}
          className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <LuMoveLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default RecentFeedback;
