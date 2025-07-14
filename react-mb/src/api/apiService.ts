import axios, { type AxiosResponse } from "axios";

const API_URL = "https://www.mukeshbhatia.org/portal/verify_api/";

const apiService = {
  checkLogin: async (loginDetails: any): Promise<AxiosResponse> => {
    return axios.post(`${API_URL}login`, loginDetails);
  },

  getCases: async (userId: string): Promise<AxiosResponse> => {
    return axios.get(`${API_URL}getCases/${userId}`).then((response) => {
      console.log(response.data);
      return response;
    });
  },

  getAttachment: async (attachmentId: string): Promise<AxiosResponse> => {
    return axios
      .get(`${API_URL}getAttachment/${attachmentId}`)
      .then((response) => {
        console.log(response.data);
        return response;
      });
  },

  addData: async (formData: any): Promise<AxiosResponse> => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return axios.post(`${API_URL}insertForms`, formData, { headers });
  },

  uploadFile: async (formData: FormData): Promise<AxiosResponse> => {
    if (formData) {
      console.log("inside upload fun ", formData);
      return axios.post(`${API_URL}uploadFile`, formData);
    }
    throw new Error("FormData is empty");
  },

  finalVerify: async (params: any): Promise<AxiosResponse> => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return axios.post(`${API_URL}FinalVerify`, params, { headers });
  },
};

export default apiService;
