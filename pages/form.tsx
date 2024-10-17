import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Form: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name_first: '',
    name_last: '',
    addresses: [
      {address_line_1: '',
        address_line_2: '',
        address_city: '',
        address_state: '',
        address_postal_code: '',
        address_country_code: 'US'}
    ],
    document_ssn: '',
    email_address: '',
    birth_date: ''
    });

  const [errors, setErrors] = useState<any>({});

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};
    
    // Validation logic (the same as before)
    if (!formData.name_first) newErrors.name_first = 'First Name is required';
    if (!formData.name_last) newErrors.name_last = 'Last Name is required';
    if (!formData.addresses[0].address_state.match(/^[A-Z]{2}$/)) newErrors.addresses[0].address_state = 'State must be a 2-letter code (ex. NY, CA)';
    if (!formData.addresses[0].address_postal_code.match(/^\d{5}$/)) newErrors.addresses[0].address_postal_code = 'Zip/Postal Code must be 5 digits';
    if (formData.addresses[0].address_country_code !== 'US') newErrors.addresses[0].address_country_code = 'Country must be US';
    if (!formData.document_ssn.match(/^\d{9}$/)) newErrors.document_ssn = 'SSN must be 9 digits with no dashes';
    if (!formData.email_address.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email_address = 'Email must be valid';
    if (!formData.birth_date.match(/^\d{4}-\d{2}-\d{2}$/)) newErrors.birth_date = 'Date of Birth must be in YYYY-MM-DD format';

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // After successful submission, redirect to the result page
          router.push({
            pathname: '/result',
            query: { success: true, data: JSON.stringify(result) } // Passing data as string
});

        } else {
          setErrors({ api: 'Failed to submit the form' });
        }
      } catch (error) {
        setErrors({ api: 'An error occurred while submitting the form' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle address changes
    if (name.startsWith('address_')) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        addresses: prevFormData.addresses.map((address, index) => {
          if (index === 0) {
            return {
              ...address,
              [name]: value,
            };
          }
          return address;
        }),
      }));
    } else {
      // Handle other input fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Information Form</h2>
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="name_first"
          value={formData.name_first}
          onChange={handleInputChange}
        />
        {errors.name_first && <span style={{ color: 'red' }}>{errors.name_first}</span>}
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="name_last"
          value={formData.name_last}
          onChange={handleInputChange}
        />
        {errors.name_last && <span style={{ color: 'red' }}>{errors.name_last}</span>}
      </div>
      <div>
        <label>Address Line 1</label>
        <input
          type="text"
          name="address_line_1"
          value={formData.addresses[0].address_line_1}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Address Line 2</label>
        <input
          type="text"
          name="address_line_2"
          value={formData.addresses[0].address_line_2}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>City</label>
        <input
          type="text"
          name="address_city"
          value={formData.addresses[0].address_city}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>State</label>
        <input
          type="text"
          name="address_state"
          value={formData.addresses[0].address_state}
          onChange={handleInputChange}
        />
        {errors.addresses && errors.addresses[0]?.address_state && <span style={{ color: 'red' }}>{errors.addresses[0].address_state}</span>}
      </div>
      <div>
        <label>Zip/Postal Code</label>
        <input
          type="text"
          name="address_postal_code"
          value={formData.addresses[0].address_postal_code}
          onChange={handleInputChange}
        />
        {errors.addresses && errors.addresses[0]?.address_postal_code && <span style={{ color: 'red' }}>{errors.addresses[0].address_postal_code}</span>}
      </div>
      <div>
        <label>Country</label>
        <input
          type="text"
          name="address_country_code"
          value={formData.addresses[0].address_country_code}
          onChange={handleInputChange}
          disabled
        />
        {errors.addresses && errors.addresses[0]?.address_country_code && <span style={{ color: 'red' }}>{errors.addresses[0].address_country_code}</span>}
      </div>
      <div>
        <label>SSN</label>
        <input
          type="text"
          name="document_ssn"
          value={formData.document_ssn}
          onChange={handleInputChange}
        />
        {errors.document_ssn && <span style={{ color: 'red' }}>{errors.document_ssn}</span>}
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          name="email_address"
          value={formData.email_address}
          onChange={handleInputChange}
        />
        {errors.email_address && <span style={{ color: 'red' }}>{errors.email_address}</span>}
      </div>
      <div>
        <label>Date of Birth (YYYY-MM-DD)</label>
        <input
          type="text"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleInputChange}
        />
        {errors.birth_date && <span style={{ color: 'red' }}>{errors.birth_date}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
