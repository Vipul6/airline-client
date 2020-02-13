import React from "react";
import "../styles/not-found.scss";
const errorImg = require("../assets/images/404.png");

const PageNotFound = () => {
  return (
    <div className="not-found-error-wrapper">
      <img src={errorImg} alt="404 not found" className="not-found-img" />
    </div>
  );
};

export default PageNotFound;
