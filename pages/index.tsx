import React, { useState } from 'react';

const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    ssn: '',
    email: '',
    dob: ''
  });

  const [errors, setErrors] = useState<any>({});

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};

    // Validation logic
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.state.match(/^[A-Z]{2}$/)) newErrors.state = 'State must be a 2-letter code (ex. NY, CA)';
    if (!formData.zipCode.match(/^\d{5}$/)) newErrors.zipCode = 'Zip/Postal Code must be 5 digits';
    if (formData.country !== 'US') newErrors.country = 'Country must be US';
    if (!formData.ssn.match(/^\d{9}$/)) newErrors.ssn = 'SSN must be 9 digits with no dashes';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email must be valid';
    if (!formData.dob.match(/^\d{4}-\d{2}-\d{2}$/)) newErrors.dob = 'Date of Birth must be in YYYY-MM-DD format';

    if (Object.keys(newErrors).length === 0) {
      alert('Form Submitted Successfully');
      // Handle form submission logic, e.g., send data to a backend.
    } else {
      setErrors(newErrors);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Information Form</h2>
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName}</span>}
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName}</span>}
      </div>
      <div>
        <label>Address Line 1</label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Address Line 2</label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
        />
        {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
      </div>
      <div>
        <label>Zip/Postal Code</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
        />
        {errors.zipCode && <span style={{ color: 'red' }}>{errors.zipCode}</span>}
      </div>
      <div>
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          disabled
        />
        {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}
      </div>
      <div>
        <label>SSN</label>
        <input
          type="text"
          name="ssn"
          value={formData.ssn}
          onChange={handleInputChange}
        />
        {errors.ssn && <span style={{ color: 'red' }}>{errors.ssn}</span>}
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <div>
        <label>Date of Birth (YYYY-MM-DD)</label>
        <input
          type="text"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
        />
        {errors.dob && <span style={{ color: 'red' }}>{errors.dob}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
