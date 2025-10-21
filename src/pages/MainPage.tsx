import AboutUs from "@/components/AboutUs";
// import FilterCars from "../components/FilterCars";
import FAQ from "@/components/FAQ";
import RecentFeedback from "@/components/RecentFeedback";
import PopularCars from "@/components/PopularCars";
import { useAppSelector } from "@/hooks/reduxStoreHooks";
import { HomepageState } from "@/types/types";
import { useEffect, useState } from "react";
import FilterMain from "@/components/FilterMain";

const MainPage = () => {
  const { aboutUs, faq, popularCars } = useAppSelector(
    (state: { homepage: HomepageState }) => state.homepage
  );
  const { feedbacks } = useAppSelector((state) => state.feedback);
  const [recentFeedbacks, setRecentFeedbacks] = useState(feedbacks);
  useEffect(() => {
    const sortedFeedbacks = [...feedbacks].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
    setRecentFeedbacks(sortedFeedbacks);
  }, [feedbacks]);
  return (
    <div className="flex flex-col gap-8 font-primary px-8">
      {/* Header */}
      <h1 className="text-[27px] sm:text-4xl md:text-[56px] font-semibold px-1 md:px-2">
        Choose a car for rental
      </h1>
      {/* <FilterCars></FilterCars> */}
      <FilterMain></FilterMain>
      <PopularCars data={popularCars} />
      <AboutUs data={aboutUs}></AboutUs>
      <RecentFeedback feedbacks={recentFeedbacks}></RecentFeedback>
      <FAQ data={faq}></FAQ>
    </div>
  );
};

export default MainPage;
