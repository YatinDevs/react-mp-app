import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message: string, options?: ToastOptions) => {
  toast(message, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options,
  });
};

export const showToastWithAction = (message: string) => {
  toast.info(message, {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const dismissToast = () => {
  toast.dismiss();
};
