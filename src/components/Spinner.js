import React from "react";
import "./spinner.scss";
const Spinner = () => {
  return (
    <div className="container">
      <div className="spinner-backdrop"></div>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
