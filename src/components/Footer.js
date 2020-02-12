import React from "react";
import "../styles/footer.scss";

const heartIcon = require("../assets/images/heart-icon.png");

const Footer = () => {
  return (
    <div className="footer-container">
      <span className="footer-text">
        Developed with
        <img src={heartIcon} alt="heart" className="heart-icon" />
        by Rahul Mehta
      </span>
    </div>
  );
};

export default Footer;
