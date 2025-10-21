import { AboutUsStoryInfo } from "@/types/types";

type AboutUsProps = {
  data: AboutUsStoryInfo[];
};

const AboutUsCard = ({
  title,
  description,
  numericValue,
}: AboutUsStoryInfo) => {
  return (
    <aside className="text-center sm:text-left">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 capitalize">
        {title}
      </h2>
      <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-4">
        {numericValue}
      </h3>
      <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
        {description}
      </p>
    </aside>
  );
};

const AboutUs = ({ data }: AboutUsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-10 md:mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex-1 text-center sm:text-left sm:w-1/2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-label">
          (ABOUT US)
        </h2>
      </div>

      <div className="flex-2 flex gap-8 flex-col sm:grid sm:grid-cols-2 ">
        {data.map((item) => {
          return (
            <div
              key={item.title}
              className="md:flex-1 space-y-8 md:space-y-12 lg:space-y-16"
            >
              <AboutUsCard
                title={item.title}
                description={item.description}
                numericValue={item.numericValue}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutUs;
