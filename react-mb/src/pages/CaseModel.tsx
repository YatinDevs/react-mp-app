import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { showToast } from "../api/toastService";

const CaseModel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, getAttachment, finalVerify } = useApi();
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        // In a real app, you would fetch case details by ID
        const mockDetails = {
          id,
          title: `Case #${id}`,
          type: "Residence Verification",
          status: "Pending",
          date: "2023-05-15",
        };
        setCaseDetails(mockDetails);

        // Fetch attachments
        const attachmentsData = await getAttachment(id!);
        setAttachments(attachmentsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCaseDetails();
  }, [id]);

  const handleFinalVerify = async () => {
    try {
      await finalVerify({
        caseId: id,
        status: verificationStatus,
        comments: "Verified by agent",
      });
      showToast("Verification submitted");
      navigate("/home");
    } catch (err) {
      showToast("Verification failed", { type: "error" });
    }
  };

  if (!caseDetails) return <div>Loading case details...</div>;

  return (
    <div className="case-model-container">
      <h2>{caseDetails.title}</h2>
      <div className="case-info">
        <p>
          <strong>Type:</strong> {caseDetails.type}
        </p>
        <p>
          <strong>Status:</strong> {caseDetails.status}
        </p>
        <p>
          <strong>Date:</strong> {caseDetails.date}
        </p>
      </div>

      <div className="attachments-section">
        <h3>Attachments</h3>
        {attachments.length > 0 ? (
          <div className="attachment-list">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="attachment-item">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  width="200"
                  onClick={() => window.open(attachment.url, "_blank")}
                  style={{ cursor: "pointer" }}
                />
                <p>{attachment.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No attachments found</p>
        )}
      </div>

      <div className="verification-section">
        <h3>Verification</h3>
        <select
          value={verificationStatus}
          onChange={(e) => setVerificationStatus(e.target.value)}
        >
          <option value="">Select verification status</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={handleFinalVerify}
          disabled={!verificationStatus || loading}
        >
          {loading ? "Processing..." : "Submit Verification"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CaseModel;
