import React, { useEffect, useRef, useState } from "react";
import { DbField } from "./types/Common";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: DbField[];
  selectedOptions: DbField[];
  onChange: (selectedOptions: DbField[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  // Function to handle clicks outside of the div
  const handleOutsideClick = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (optionValue: DbField) => {
    const updatedSelectedOptions = selectedOptions.some(obj=>obj.id === optionValue.id)
      ? selectedOptions.filter((value) => value.id !== optionValue.id)
      : [...selectedOptions, optionValue];
    onChange(updatedSelectedOptions);
  };
  const handleSelectAll = (value: boolean) => {
    if (value) {
      onChange([...options.map((a) => a)]);
    } else {
      onChange([]);
    }
  };
  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="multi-select-dropdown">
      <div className="form-select" onClick={toggleDropdown}>
        {
          selectedOptions.length === 0
            ? "Select"
            : selectedOptions.length + " fields selected"
        }
      </div>
      {isOpen && (
        <div className="list-group" ref={divRef}>
          <div className="list-group-item" key="-99">
            {options.length > 0 ? (
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />

                <label className="form-check-label" htmlFor="Select All">
                  Select
                </label>
              </div>
            ) : <div className="list-group-item">No item</div>}
          </div>
          {options.map((option) => (
            <div className="list-group-item" key={option.value}>
              <div className="form-check">
                <input
                  id={option.label}
                  className="form-check-input"
                  type="checkbox"
                  value={option.value}
                  checked={selectedOptions.some(obj=>obj.id === option.id)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <label className="form-check-label" htmlFor={option.label}>
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
