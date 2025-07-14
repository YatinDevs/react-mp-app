import React, { useState } from "react";
import useApi from "../hooks/useApi";
import useCamera from "../hooks/useCamera";
import useLocation from "../hooks/useLocation";
import { showToast } from "../api/toastService";

interface AssetFormData {
  assetType: string;
  description: string;
  location: string;
  coordinates: string;
  photos: string[];
}

interface FileUploadResponse {
  success: boolean;
  message: {
    fileUrl: string;
  };
}

const AssetVerification: React.FC = () => {
  const [formData, setFormData] = useState<AssetFormData>({
    assetType: "",
    description: "",
    location: "",
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
    (field: keyof Omit<AssetFormData, "photos" | "coordinates">) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
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
        assetType: "",
        description: "",
        location: "",
        coordinates: "",
        photos: [],
      });
    } catch (err) {
      showToast(error || "Submission failed", { type: "error" });
    }
  };

  return (
    <div className="verification-container">
      <h2>Asset Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asset Type</label>
          <select
            value={formData.assetType}
            onChange={handleInputChange("assetType")}
            required
          >
            <option value="">Select Asset Type</option>
            <option value="property">Property</option>
            <option value="vehicle">Vehicle</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={handleInputChange("description")}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={handleInputChange("location")}
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
          <label>Upload Asset Photos</label>
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
                <img src={photo} alt={`Asset ${index + 1}`} />
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

export default AssetVerification;
