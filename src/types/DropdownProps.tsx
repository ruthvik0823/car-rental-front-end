export interface DropdownProps {
  title?: string;
  placeholder?: string;
  options: string[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  isNavbarDrop?: boolean;
  userName?: string;
}
