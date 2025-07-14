import React, { useState } from "react";
import useApi from "../hooks/useApi";
import useCamera from "../hooks/useCamera";
import { showToast } from "../api/toastService";

interface DocumentFormData {
  documentType: string;
  documentNumber: string;
  photos: string[];
}

interface FileUploadResponse {
  success: boolean;
  message: {
    fileUrl: string;
  };
}

const DocumentVerification: React.FC = () => {
  const [formData, setFormData] = useState<DocumentFormData>({
    documentType: "",
    documentNumber: "",
    photos: [],
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
        photos: [...prev.photos, response.message.fileUrl],
      }));
      showToast("Document uploaded successfully");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Upload failed", { type: "error" });
    }
  };

  const handleInputChange =
    (field: keyof Omit<DocumentFormData, "photos">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        documentType: "",
        documentNumber: "",
        photos: [],
      });
    } catch (err) {
      showToast(error || "Submission failed", { type: "error" });
    }
  };

  return (
    <div className="verification-container">
      <h2>Document Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document Type</label>
          <select
            value={formData.documentType}
            onChange={handleInputChange("documentType")}
            required
          >
            <option value="">Select Document Type</option>
            <option value="passport">Passport</option>
            <option value="id_card">ID Card</option>
            <option value="driving_license">Driving License</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Document Number</label>
          <input
            type="text"
            value={formData.documentNumber}
            onChange={handleInputChange("documentNumber")}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Document Photos</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && <div className="upload-status">Uploading...</div>}
          <div className="preview-container">
            {formData.photos.map((photo, index) => (
              <div key={index} className="photo-preview">
                <img src={photo} alt={`Document ${index + 1}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      photos: prev.photos.filter((_, i) => i !== index),
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

export default DocumentVerification;
