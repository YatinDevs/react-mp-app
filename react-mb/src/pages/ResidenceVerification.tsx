import React, { useState } from "react";
import useApi from "../hooks/useApi";
import useCamera from "../hooks/useCamera";
import { showToast } from "../api/toastService";
import useLocation from "../hooks/useLocation";

interface ResidenceFormData {
  address: string;
  coordinates: string;
  photos: string[];
}

interface FileUploadResponse {
  success: boolean;
  message: {
    fileUrl: string;
  };
}

const ResidenceVerification: React.FC = () => {
  const [formData, setFormData] = useState<ResidenceFormData>({
    address: "",
    coordinates: "",
    photos: [],
  });

  const { loading, error, addData } = useApi();
  const { isUploading, handleFileUpload } = useCamera();
  const { getCurrentLocation, isGettingLocation, locationError } =
    useLocation();

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
      showToast("Photo uploaded successfully");
    } catch (err) {
      const error = err as Error;
      showToast(error.message || "Upload failed", { type: "error" });
    }
  };

  const handleGetLocation = async () => {
    try {
      const position = await getCurrentLocation();
      setFormData((prev) => ({
        ...prev,
        coordinates: `${position.coords.latitude}, ${position.coords.longitude}`,
      }));
      showToast("Location captured successfully");
    } catch (err) {
      showToast(locationError || "Failed to get location", { type: "error" });
    }
  };

  const handleInputChange =
    (field: keyof Omit<ResidenceFormData, "photos" | "coordinates">) =>
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
        address: "",
        coordinates: "",
        photos: [],
      });
    } catch (err) {
      showToast(error || "Submission failed", { type: "error" });
    }
  };

  return (
    <div className="verification-container">
      <h2>Residence Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={handleInputChange("address")}
            required
          />
        </div>

        <div className="form-group">
          <label>Coordinates</label>
          <div className="coordinates-input">
            <input
              type="text"
              value={formData.coordinates}
              readOnly
              placeholder="Click button to get coordinates"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation
                ? "Getting Location..."
                : "Get Current Location"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Upload Photos</label>
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
                <img src={photo} alt={`Residence ${index + 1}`} />
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
          disabled={loading || isUploading || isGettingLocation}
          className="submit-button"
        >
          {loading ? "Submitting..." : "Submit Verification"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default ResidenceVerification;
