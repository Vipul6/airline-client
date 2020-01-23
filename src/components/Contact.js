import React from "react";

const Contact = (props) => {
  const routeParams = props.match.path;
  if (routeParams === "/contact") {
    props.updateActiveLink("contact");
  }
  return <div style={styles.container}>Contact</div>;
};

const styles = {
  container: {
    marginTop: "70px",
    paddingRight: "15px",
    paddingLeft: "15px"
  }
};

export default Contact;
