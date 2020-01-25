import React from "react";
import "../styles/spinner.scss";
const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-backdrop"></div>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
