import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";

const Home: React.FC = () => {
  const { loading, error, getCases } = useApi();
  const [cases, setCases] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getCases("2");
        setCases(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCases();
  }, []);

  return (
    <div className="home-container">
      <h1>Verification Portal</h1>

      {loading && <p>Loading cases...</p>}
      {error && <p className="error">{error}</p>}

      <div className="case-list">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="case-card">
            <h3>{caseItem.title}</h3>
            <p>Status: {caseItem.status}</p>
            <Link to={`/case-model/${caseItem.id}`}>View Details</Link>
          </div>
        ))}
      </div>

      <nav className="main-nav">
        <Link to="/residence-verification">Residence Verification</Link>
        <Link to="/business-verification">Business Verification</Link>
        <Link to="/document-verification">Document Verification</Link>
        <Link to="/employment-verification">Employment Verification</Link>
        <Link to="/asset-verification">Asset Verification</Link>
      </nav>
    </div>
  );
};

export default Home;
