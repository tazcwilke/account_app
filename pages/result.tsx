import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

// Define the shape of the data object
type Summary = {
  outcome: string;
};

type Data = {
  message: string;
  data?: {
    summary: Summary;
  };
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { query } = context;
  
    // Decode and parse the data from the query string
    let data: Data = { message: '' }; // Initialize with default structure
    try {
      const parsedData = JSON.parse(decodeURIComponent(query.data as string || '{}'));
      console.log('Parsed Data:', parsedData); // Debug: Log the parsed data to check its structure
      data = parsedData;
    } catch (error) {
      console.error('Failed to parse query data:', error);
    }
  
    return {
      props: { data },
    };
  };
  
  const ResultPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
    const { message } = data; // Message is at the top level
    const outcome = data?.data?.summary?.outcome; // Correctly access the outcome from data.data.summary
   
    console.log('Outcome:', outcome); // Debug: Log the outcome to ensure it's being parsed
   
    // Function to display different messages based on the outcome value
    const getOutcomeMessage = (outcome: string | undefined) => {
      switch (outcome) {
        case 'Approved':
          return 'Congratulations! You have been approved and an account has successfully been created for you!';
        case 'Manual Review':
          return 'Thanks for submitting your application, we will be in touch shortly.';
        case 'Denied':
          return 'Sorry, your application was not successful.';
        default:
          return 'An unexpected outcome occurred. Please contact support.';
      }
    };
   
   
    return (
      <div>
        <h1>Application Status</h1>
        {data ? (
          <div>
            <p>{getOutcomeMessage(outcome)}</p> {/* Display dynamic outcome message */}
          </div>
        ) : (
          <p>There was an error submitting the application.</p>
        )}
      </div>
    );
   };
   
   
   export default ResultPage;
