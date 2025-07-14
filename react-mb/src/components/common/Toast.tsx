import { ToastContainer } from "react-toastify";

const Toast = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default Toast;
