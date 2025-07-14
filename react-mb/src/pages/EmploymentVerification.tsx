import React, { useState } from "react";
import useApi from "../hooks/useApi";
import useCamera from "../hooks/useCamera";
import { showToast } from "../api/toastService";

interface EmploymentFormData {
  employerName: string;
  employeeName: string;
  position: string;
  startDate: string;
  documents: string[];
}

interface FileUploadResponse {
  success: boolean;
  message: {
    fileUrl: string;
  };
}

const EmploymentVerification: React.FC = () => {
  const [formData, setFormData] = useState<EmploymentFormData>({
    employerName: "",
    employeeName: "",
    position: "",
    startDate: "",
    documents: [],
  });

  const { loading, error, addData } = useApi();
  const { isUploading, handleFileUpload } = useCamera();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      const result = await handleFileUpload(e.target.files[0]);
      const response = result as FileUploadResponse;

      if (!response.success || !response.message?.fileUrl) {
        throw new Error("Invalid server response");
      }

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, response.message.fileUrl],
      }));
      showToast("Document uploaded successfully");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Upload failed", { type: "error" });
    }
  };

  const handleInputChange =
    (field: keyof Omit<EmploymentFormData, "documents">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addData(formData);
      showToast("Verification submitted successfully");
      setFormData({
        employerName: "",
        employeeName: "",
        position: "",
        startDate: "",
        documents: [],
      });
    } catch (err) {
      showToast(error || "Submission failed", { type: "error" });
    }
  };

  return (
    <div className="verification-container">
      <h2>Employment Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employer Name</label>
          <input
            type="text"
            value={formData.employerName}
            onChange={handleInputChange("employerName")}
            required
          />
        </div>

        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            value={formData.employeeName}
            onChange={handleInputChange("employeeName")}
            required
          />
        </div>

        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={handleInputChange("position")}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={handleInputChange("startDate")}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Supporting Documents</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && <div className="upload-status">Uploading...</div>}
          <div className="preview-container">
            {formData.documents.map((doc, index) => (
              <div key={index} className="document-preview">
                <img src={doc} alt={`Document ${index + 1}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      documents: prev.documents.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isUploading}
          className="submit-button"
        >
          {loading ? "Submitting..." : "Submit Verification"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default EmploymentVerification;
