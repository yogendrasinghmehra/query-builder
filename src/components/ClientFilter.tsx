import React, { useState } from 'react'
import formConfig from '../data/form-config.json'

interface FormField {
  id: string;
  label: string;
  type: string;
  value: any;
}
const formData: FormField[] = formConfig


const ClientFilter:React.FC = () => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formValues); // Handle form submission logic here
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
      {formData.map((field) => (
        <div key={field.id} className='form-group'>
          <label htmlFor={field.id}>{field.label}</label>
          
          {field.type === 'checkbox' ? (
            <input              
              type="checkbox"
              id={field.id}
              name={field.id}
              checked={formValues[field.id] || false}
              onChange={handleChange}
            />
          ) : field.type === 'select' ? (
            <select
            className='form-control'                         
            id={field.id}
            name={field.id}            
            onChange={handleSelectChange}
          >
            <option value=''>Select</option>
            <option value='1'>Client</option>
            <option value='2'>Member</option>
          </select>
          ) 
          
          : (
            <input
              className='form-control'
              type={field.type}
              id={field.id}
              name={field.id}
              value={formValues[field.id] || ''}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
        <button className='btn btn-primary mt-3' type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ClientFilter
