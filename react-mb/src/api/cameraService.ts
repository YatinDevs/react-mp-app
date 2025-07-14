import apiService from "./apiService";

export const takePhoto = async (options: any) => {
  try {
    // For web implementation - would need different implementation for mobile
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      // Handle stream (would need video element)
      return stream;
    }
    throw new Error("Camera not available");
  } catch (error) {
    console.error("Error accessing camera:", error);
    throw error;
  }
};

export const uploadImage = async (formData: FormData) => {
  try {
    const response = await apiService.uploadFile(formData);
    console.log("upload image file function ", response.data);
    if (response.data.success === "true") {
      return { success: true, message: "Successfully uploaded photo" };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const readFile = (file: File): Promise<FormData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result as ArrayBuffer], {
        type: file.type,
      });
      formData.append("file", imgBlob, file.name);
      resolve(formData);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
