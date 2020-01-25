import React from "react";

const About = props => {
  const routeParams = props.match.path;
  if (routeParams === "/about") {
    props.updateActiveLink("about");
  }
  return <div style={styles.container}>about</div>;
};

const styles = {
  container: {
    marginTop: "70px",
    paddingRight: "15px",
    paddingLeft: "15px"
  }
};

export default About;
