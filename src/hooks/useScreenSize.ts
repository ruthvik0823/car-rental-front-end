import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<"sm" | "lg" | "default">(
    "default"
  );

  useEffect(() => {
    const smQuery = window.matchMedia("(min-width: 640px)");
    const lgQuery = window.matchMedia("(min-width: 1024px)");

    const updateSize = () => {
      if (lgQuery.matches) {
        setScreenSize("lg");
      } else if (smQuery.matches) {
        setScreenSize("sm");
      } else {
        setScreenSize("default");
      }
    };

    updateSize();

    smQuery.addEventListener("change", updateSize);
    lgQuery.addEventListener("change", updateSize);

    return () => {
      smQuery.removeEventListener("change", updateSize);
      lgQuery.removeEventListener("change", updateSize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
