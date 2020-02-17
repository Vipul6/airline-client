import React from "react";
import Carousel from "./Carousel";
import "../styles/about.scss";

const About = props => {
  const routeParams = props.match.path;
  if (routeParams === "/about") {
    props.updateActiveLink("about");
  }

  const history = () => {
    return (
      <div className="history-wrapper">
        <span className="about-title">Who we are ?</span>
        <span className="history-content">
          <span className="para-title"> Cruzer Airlines </span> was incorporated
          in February 2020 in Bangalore, India. The Company is one of the fast
          growing & profitable travel company in Asia's online space driven by
          technology, better buyingdue to demand aggregation & forward cash
          flows. The Company is a leading distributor of transportation
          ticketing, accommodation reservation,packaged tours, corporate travel
          management, travel ancillaries, retail and financial services. The
          compant offers a comprehensive suite of travel & retail products and
          growing set of financial services products, provided by 10,000+
          suppliers on the platform. The company offers its services through a
          robust, highly scalable cloud based technology platform consisting of
          mobile apps, websites, corporate platform, and a centralized,
          toll-free, 24-hour customer service center.
        </span>
        <span className="history-content">
          <span className="para-title"> Cruzer Airlines's </span>
          Corporate Travel Management Business unit helps corporate clients
          effectively manage their travel needs and significantly reduce travel
          expenses. Cruzer Airlines expanded its footprints to Philippines,
          Indonesia, Singapore and UAE. Today, Via's network include over
          100,000 active travel partners across 2,600 towns and cities & over
          13,000 pin codes across Asia and over 7000+ signed SMEs.
        </span>
        <div className="paragraph-wrapper">
          <div className="para-holder">
            <span className="para-title">We make selling very easy.</span>
            <span className="para-content">
              We started with the premise of selling travel, not necessarily
              under our brand, but to everyone through our partners, world class
              travel products and services in every neighborhood and deliver
              great customer service. We serve over 2 million customers that
              walk into our outlets everyday, that you can practically find in
              your neighborhood. We are the
              <span className="para-title"> Cruzer Airlines </span>
              Inside Of the Travel World.
            </span>
          </div>
          <div className="para-holder">
            <span className="para-title">Unbelievable customer service.</span>
            <span className="para-content">
              NO customer calls when all is well. We believe customer service
              starts with listening to the customer, owning what is wrong and
              then going out of your way to fix it. That's it, it does not mean,
              large call centers flooded with hundreds of souls or jazzy 1-800
              numbers. Just a simple email or SMS will do. We will call you
              back. We fundamentally believe most problems can be eliminated by
              design and the rest by listening.
            </span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="snackbar-alignment">
      {history()}
      <div className="carousel-container">
        <Carousel />
      </div>
    </div>
  );
};

export default About;
