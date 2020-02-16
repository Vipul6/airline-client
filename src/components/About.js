import React from "react";
import Carousel from "./Carousel";

const About = props => {
  const routeParams = props.match.path;
  if (routeParams === "/about") {
    props.updateActiveLink("about");
  }
  return (
    <div className="snackbar-alignment">
      about
      <Carousel />
    </div>
  );
};

export default About;
