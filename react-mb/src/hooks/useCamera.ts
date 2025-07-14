import { useState } from "react";
import { readFile, uploadImage } from "../api/cameraService";
import { showToast } from "../api/toastService";

const useCamera = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = await readFile(file);
      const result = await uploadImage(formData);
      showToast(result.message);
      return result;
    } catch (error) {
      showToast("Please try again", { type: "error" });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    // Implementation would vary based on platform (web/mobile)
    // This is a simplified web version
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return stream;
    } catch (error) {
      showToast("Camera access denied", { type: "error" });
      throw error;
    }
  };

  return {
    isUploading,
    handleFileUpload,
    takePhoto,
  };
};

export default useCamera;
