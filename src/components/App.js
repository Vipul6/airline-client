import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/app.scss";

const App = () => {
  return (
    <React.Fragment>
      <div className="body-container-class">
        <div className="body-content-wrapper">
          <Header />
        </div>
        <div className="body-footer-container">
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
