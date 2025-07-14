import React, { useState } from "react";
import useApi from "../hooks/useApi";
import useCamera from "../hooks/useCamera";
import { showToast } from "../api/toastService";

interface FormData {
  businessName: string;
  registrationNumber: string;
  address: string;
  photos: string[];
}

interface ApiResponse {
  success: boolean;
  message: {
    fileUrl: string;
    // Add other properties your API returns
  };
}

const BusinessVerification: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    registrationNumber: "",
    address: "",
    photos: [],
  });

  const { loading, error, addData } = useApi();
  const { isUploading, handleFileUpload } = useCamera();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      const file = e.target.files[0];

      // Upload the file and validate response
      const result = await handleFileUpload(file);
      const response = result as ApiResponse;

      if (!response.success || !response.message?.fileUrl) {
        throw new Error(
          response.message?.toString() || "Invalid server response"
        );
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, response.message.fileUrl],
      }));

      showToast("File uploaded successfully");
    } catch (err) {
      const error = err as Error;
      console.error("Upload error:", error);
      showToast(error.message || "File upload failed", { type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addData(formData);
      showToast("Verification submitted successfully");
      // Reset form after successful submission if needed
      setFormData({
        businessName: "",
        registrationNumber: "",
        address: "",
        photos: [],
      });
    } catch (err) {
      const error = err as Error;
      console.error("Submission error:", error);
      showToast(error.message || "Verification failed", { type: "error" });
    }
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <div className="verification-container">
      <h2>Business Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={handleInputChange("businessName")}
            required
          />
        </div>

        <div className="form-group">
          <label>Registration Number</label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={handleInputChange("registrationNumber")}
            required
          />
        </div>

        <div className="form-group">
          <label>Business Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={handleInputChange("address")}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Documents/Photos</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            multiple // Allow multiple files if needed
          />
          {isUploading && <div className="upload-status">Uploading...</div>}
          <div className="preview-container">
            {formData.photos.map((photo, index) => (
              <div key={index} className="photo-preview">
                <img src={photo} alt={`Uploaded ${index + 1}`} />
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

export default BusinessVerification;
