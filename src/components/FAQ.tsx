import { RxCross2 } from "react-icons/rx";
import { RxPlus } from "react-icons/rx";
import { FAQStory } from "@/types/types";
import { useState } from "react";

type FAQProps = {
  data: FAQStory[];
};

const FAQ = ({ data }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 my-10 md:my-16 lg:my-20 px-4 sm:px-6 lg:px-8">
      <div className="md:flex-1 text-center md:text-left">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-label">
          (FAQ)
        </h2>
      </div>
      <div className="md:flex-2 space-y-4 md:-ml-6 lg:-ml-10 divide-border divide-y md:divide-y-2">
        {data.map((faq: FAQStory, index: number) => (
          <div className="py-2 md:py-6 first:pt-0" key={faq.question}>
            <div className="flex justify-between items-start md:items-center gap-4 md:gap-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl flex-1">
                {faq.question}
              </h2>
              <div className="flex items-center justify-center text-2xl border-2 rounded-full border-border">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  {openIndex === index ? <RxCross2 /> : <RxPlus />}
                </button>
              </div>
            </div>
            {openIndex === index && (
              <p className="flex-wrap text-label text-2xl">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
