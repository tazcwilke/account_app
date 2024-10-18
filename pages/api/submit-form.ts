import { NextApiRequest, NextApiResponse } from 'next';

// This is your backend API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    const { name_first, name_last, addresses, document_ssn, email_address, birth_date } = req.body;
    const stringToEncode = process.env.EXTERNAL_API_TOKEN + ':' + process.env.EXTERNAL_API_SECRET;
    const base64Encoded = Buffer.from(stringToEncode).toString('base64');

    // Here you can add additional server-side validation if needed
    const errors: any = {};

    if (!name_first) errors.name_first = 'First Name is required';
    if (!name_last) errors.name_last = 'Last Name is required';
    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      errors.addresses = 'At least one address is required';
    } else {
      const address = addresses[0];
      if (!address.address_state.match(/^[A-Z]{2}$/)) {
        errors.address_state = 'State must be a 2-letter code (ex. NY, CA)';
      }
      if (!address.address_postal_code.match(/^\d{5}$/)) {
        errors.address_postal_code = 'Zip/Postal Code must be 5 digits';
      }
      if (address.address_country_code !== 'US') {
        errors.address_country_code = 'Country must be US';
      }
    }
    if (!document_ssn.match(/^\d{9}$/)) errors.document_ssn = 'SSN must be 9 digits with no dashes';
    if (!email_address.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email_address = 'Email must be valid';
    if (!birth_date.match(/^\d{4}-\d{2}-\d{2}$/)) errors.birth_date = 'Date of Birth must be in YYYY-MM-DD format';

    // If there are errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    //console.log('Request body:', JSON.stringify(req.body, null, 2));
    try {
        // Call the external API (replace 'https://sandbox.alloy.co/v1/evaluations' with the actual API URL)
        const externalApiResponse = await fetch('https://sandbox.alloy.co/v1/evaluations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${base64Encoded}`,
          },
          body: JSON.stringify(req.body),
        });
        console.log(externalApiResponse);
        if (externalApiResponse.ok) {
          const apiData = await externalApiResponse.json();
          // Respond back to the client with success
          res.status(200).json({ message: 'Form successfully submitted', data: apiData });
        } else {
          const errorMessage = await externalApiResponse.text(); // Capture the response error message
          res.status(externalApiResponse.status).json({ message: 'Failed to submit form to external API', error: errorMessage });
        }
      } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ message: 'An error occurred while connecting to the external API', error: error.message });
        } else {
          return res.status(500).json({ message: 'An unknown error occurred', error: String(error) });
        }
      }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
