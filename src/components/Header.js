import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Spinner from "./Spinner";
import Home from "./Home";
import "../styles/header.scss";

const AsyncFlight = lazy(() => import("./Flight"));
const AsyncAbout = lazy(() => import("./About"));
const AsyncContact = lazy(() => import("./Contact"));
const AsyncPageNotFound = lazy(() => import("./PageNotFound"));
const AsyncCheckIn = lazy(() => import("./CheckIn"));
const AsyncInFlight = lazy(() => import("./InFlight"));

const flightLogo = require("../assets/images/flight-logo.png");
const googleLogo = require("../assets/images/google-logo.png");

const Header = () => {
  const [activeLink, setActiveLink] = useState("");
  const [menu, setMenuClass] = useState(true);

  const updateActiveLink = link => {
    setActiveLink(link);
  };

  return (
    <React.Fragment>
      <Suspense fallback={<Spinner />}>
        <Router>
          <header className="nav-container">
            <div className="navbar">
              <div className="logo-container">
                <Link to="/" className="logo">
                  <img src={flightLogo} alt="logo" className="flight-logo" />
                  <span className="flight-logo-text">Cruzer Airlines</span>
                </Link>
              </div>
              <nav className="nav-links-container">
                <Link
                  className={activeLink === "home" ? "active-link" : "links"}
                  to="/"
                >
                  Home
                  {activeLink === "home" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
                <Link
                  className={activeLink === "flights" ? "active-link" : "links"}
                  to="/flights"
                >
                  Flights
                  {activeLink === "flights" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
                <Link
                  className={activeLink === "about" ? "active-link" : "links"}
                  to="/about"
                >
                  About
                  {activeLink === "about" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
                <Link
                  className={activeLink === "contact" ? "active-link" : "links"}
                  to="/contact"
                >
                  Contact
                  {activeLink === "contact" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
              </nav>
              <div className="roles-container">
                <button
                  className="login-button"
                  onClick={() =>
                    (window.location.href = `${process.env.REACT_APP_BASE_URL}auth/passport/google`)
                  }
                >
                  <img
                    className="google-logo"
                    alt="google-logo"
                    src={googleLogo}
                  ></img>
                  <span className="google-logo-text">Sign in</span>
                </button>
              </div>
              <div
                className={menu ? "menu" : "menu-open"}
                onClick={() => setMenuClass(!menu)}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          </header>
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home {...props} updateActiveLink={updateActiveLink} />
              )}
            />
            <Route
              exact
              path="/flights"
              render={props => (
                <AsyncFlight {...props} updateActiveLink={updateActiveLink} />
              )}
            />
            <Route
              path="/about"
              exact
              render={props => (
                <AsyncAbout {...props} updateActiveLink={updateActiveLink} />
              )}
            />
            <Route
              path="/contact"
              exact
              render={props => (
                <AsyncContact {...props} updateActiveLink={updateActiveLink} />
              )}
            />
            <Route
              path="/flights/:flightId/check-in"
              exact
              render={props => (
                <AsyncCheckIn {...props} updateActiveLink={updateActiveLink} />
              )}
            />
            <Route
              path="/flights/:flightId/in-flight"
              exact
              render={props => (
                <AsyncInFlight {...props} updateActiveLink={updateActiveLink} />
              )}
            />
            <Route path="*" component={AsyncPageNotFound} />
          </Switch>
        </Router>
      </Suspense>
    </React.Fragment>
  );
};

export default Header;
