export const getServerSideProps = async (context) => {
    const { query } = context;
  
    // Decode and parse the data from the query string
    let data = {};
    try {
      data = JSON.parse(decodeURIComponent(query.data || '{}'));
    } catch (error) {
      console.error('Failed to parse query data:', error);
    }
  
    return {
      props: { data },
    };
  };
  
  const ResultPage: React.FC = ({ data }) => {
    const { message } = data; // Message is at the top level
    const outcome = data?.data?.summary?.outcome; // Outcome is nested inside data.summary
  
    return (
      <div>
        <h1>Form Submission Result</h1>
        {data ? (
          <div>
            <p>Message: {message}</p>
            <p>Outcome: {outcome}</p>
          </div>
        ) : (
          <p>There was an error submitting the form.</p>
        )}
      </div>
    );
  };
  
  export default ResultPage;
