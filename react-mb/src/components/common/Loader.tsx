import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <div className="loader-message">Please wait...</div>
    </div>
  );
};

export default Loader;
