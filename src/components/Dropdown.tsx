import { useEffect, useRef } from "react";
import { DropdownProps } from "../types/DropdownProps";
import { SlArrowDown } from "react-icons/sl";

const Dropdown = ({
  title,
  options,
  isOpen,
  setIsOpen,
  selectedOption,
  setSelectedOption,
  className,
  isNavbarDrop,
  userName,
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to track the dropdown element

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, [setIsOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <label className="text-label text-xs font-normal">{title}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          className
            ? className
            : "w-full text-left border border-gray-300 px-3 py-2 rounded-lg cursor-pointer mt-1"
        }`}
      >
        <div className="flex justify-between items-center">
          {isNavbarDrop ? userName : selectedOption}
          {!isNavbarDrop && (
            <span className="float-right">
              <SlArrowDown className="text-label" />
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute w-full border bg-white border-border rounded-md mt-1 shadow-lg p-4 z-10 ">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-1 cursor-pointer rounded ${
                selectedOption === option
                  ? "bg-black text-white my-1"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
