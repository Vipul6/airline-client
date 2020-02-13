import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import { Container } from "@material-ui/core";
import "../styles/carausel.scss";

const Carousel = () => {
  const [currentIndex, setIndex] = useState(0);
  const imgPathArray = [
    require("../assets/images/bangalore.jpg"),
    require("../assets/images/mumbai.jpg"),
    require("../assets/images/shimla.jpg"),
    require("../assets/images/goa.jpg")
  ];

  useEffect(() => {
    const updateIndex = () => {
      if (currentIndex === 3) {
        setIndex(0);
      } else {
        setIndex(currentIndex + 1);
      }
    };
    setTimeout(() => {
      updateIndex();
    }, 2500);
  }, [currentIndex]);

  return (
    <React.Fragment>
      <Container>
        <Card className="carausel-card">
          <img
            alt="pictures"
            src={imgPathArray[currentIndex]}
            className="carausel-image"
          ></img>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default Carousel;
