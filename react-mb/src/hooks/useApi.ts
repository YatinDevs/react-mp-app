import { useState } from "react";
import apiService from "../api/apiService";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (apiCall: () => Promise<any>): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkLogin: (loginDetails: any) =>
      request(() => apiService.checkLogin(loginDetails)),
    getCases: (userId: string) => request(() => apiService.getCases(userId)),
    getAttachment: (attachmentId: string) =>
      request(() => apiService.getAttachment(attachmentId)),
    addData: (formData: any) => request(() => apiService.addData(formData)),
    uploadFile: (formData: FormData) =>
      request(() => apiService.uploadFile(formData)),
    finalVerify: (params: any) => request(() => apiService.finalVerify(params)),
  };
};

export default useApi;
