import React, { useEffect, useRef, useState } from 'react';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectDropdownProps {
    options: Option[];
    selectedOptions: string[];
    onChange: (selectedOptions: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedOptions, onChange }) => {
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

    const handleCheckboxChange = (optionValue: string) => {
        const updatedSelectedOptions = selectedOptions.includes(optionValue)
            ? selectedOptions.filter((value) => value !== optionValue)
            : [...selectedOptions, optionValue];
        onChange(updatedSelectedOptions);
    };
    useEffect(() => {
        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleOutsideClick);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="multi-select-dropdown">
            <div className="form-control" onClick={toggleDropdown}>
                {selectedOptions.length === 0 ? ('Select')
                    : selectedOptions.length + " fields selected"
                        // : selectedOptions.map((val, index) => (
                        //     <span className='badge bg-primary m-1'>{val}</span>
                        // ))
                        }
            </div>
            {isOpen && (
                <div className="list-group" ref={divRef}>
                    {options.map((option) => (
                        <div className='list-group-item' key={option.value}>
                            <div className="form-check">
                                <input
                                    id={option.label}
                                    className="form-check-input"
                                    type="checkbox"
                                    value={option.value}
                                    checked={selectedOptions.includes(option.value)}
                                    onChange={() => handleCheckboxChange(option.value)} />
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
