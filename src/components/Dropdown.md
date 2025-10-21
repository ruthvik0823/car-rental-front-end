This markdown file serves as a guide to effectively use and customize the reusable Dropdown component.
The component is designed to provide flexibility and options for real-world scenarios, so here are some best practices, tips, and ideas for usage.

Here’s a quick overview of the props supported by the Dropdown component and how to use them effectively:

-----------------------------------------------------------------------------------------------------------------------------------------------------
| Prop Name             | Type             | Description                                                                                            |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| title(optional)       | string           | A label displayed above the dropdown button to indicate the purpose of the dropdown.                   |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| placeholder(optional) | string           | A label displayed above the dropdown button to indicate the purpose of the dropdown.                   |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| options               | string[]         | An array of options (strings) displayed in the dropdown. This can be dynamically manipulated.          |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| isOpen                | boolean          | A state variable to control whether the dropdown is open or closed. Should come from the parent.       |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| setIsOpen             | (value: boolean) | A function to update the dropdown’s open/close state. Defined in the parent and passed down as a prop. |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| selectedOption        | string           | A state variable containing the value of the currently selected dropdown option.                       |
-----------------------------------------------------------------------------------------------------------------------------------------------------
| setSelectedOption     | (value: string)  | A function to update the currently selected option in the parent.                                      |
-----------------------------------------------------------------------------------------------------------------------------------------------------

Tips for Effective Usage

const [isOpen, setIsOpen] = useState(false);
const [selectedOption, setSelectedOption] = useState("Placeholder");
const options = ["Option 1", "Option 2", "Option 3"];

<Dropdown
  title="Filterable Dropdown"
  options={filteredOptions} 
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  selectedOption={selectedOption}
  setSelectedOption={setSelectedOption}
/>

export interface DropdownProps {
  title?: string;
  placeholder?: string;
  options: string[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}