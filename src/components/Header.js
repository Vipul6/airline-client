import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import Spinner from "./Spinner";
import Home from "./Home";
import "../styles/header.scss";
import { ClickAwayListener } from "@material-ui/core";
import { useSelector } from "react-redux";
import SideBar from "./Sidebar";

const AsyncFlight = lazy(() => import("./Flight"));
const AsyncAbout = lazy(() => import("./About"));
const AsyncPageNotFound = lazy(() => import("./PageNotFound"));
const AsyncCheckIn = lazy(() => import("./CheckIn"));
const AsyncInFlight = lazy(() => import("./InFlight"));
const AsyncManagePassengers = lazy(() => import("./ManagePassengers"));
const AsyncManageServices = lazy(() => import("./ManageServices"));

const flightLogo = require("../assets/images/flight-logo.png");
const googleLogo = require("../assets/images/google-logo.png");
const adminIcon = require("../assets/images/admin-icon.png");
const staffIcon = require("../assets/images/staff-icon.png");

const Header = () => {
  const [activeLink, setActiveLink] = useState("");
  const [menu, setMenuClass] = useState(true);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const userDetails = useSelector(state => state.userDetails);

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  });

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  const updateActiveLink = link => {
    setActiveLink(link);
  };

  const handleRoleClick = () => {
    setOpen(prev => !prev);
  };

  const hideSidebar = () => {
    setMenuClass(true);
  };

  const handleRoleClickAway = () => {
    setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  const getRoles = () => {
    const role = sessionStorage.getItem("role");
    return (
      <ClickAwayListener onClickAway={handleRoleClickAway}>
        <img
          src={role === "Admin" ? adminIcon : staffIcon}
          alt="role"
          className="roles-img"
          onClick={handleRoleClick}
        />
      </ClickAwayListener>
    );
  };

  const updateRole = userRole => {
    const role = sessionStorage.role;
    if (role && role !== userRole) {
      sessionStorage.setItem("role", userRole);
    }
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
              </nav>
              <div className="roles-container">
                {userDetails || sessionStorage.id ? (
                  getRoles()
                ) : (
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
                )}
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

          {open ? (
            <div className="role-wrapper-container">
              <div className="role-wrapper">
                <div className="role-options">
                  <Link
                    className={
                      sessionStorage.role === "Staff" ? "role active" : "role"
                    }
                    onClick={() => updateRole("Staff")}
                    to="/"
                  >
                    Staff
                  </Link>
                  <Link
                    className={
                      sessionStorage.role === "Admin" ? "role active" : "role"
                    }
                    onClick={() => updateRole("Admin")}
                    to="/"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          {width > 800 && !menu ? hideSidebar() : null}

          {!menu ? <SideBar hideSidebar={hideSidebar} /> : null}

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
            <Route
              path="/flights/:flightId/manage-passengers"
              exact
              render={props => (
                <AsyncManagePassengers
                  {...props}
                  updateActiveLink={updateActiveLink}
                />
              )}
            />
            <Route
              path="/flights/:flightId/manage-services"
              exact
              render={props => (
                <AsyncManageServices
                  {...props}
                  updateActiveLink={updateActiveLink}
                />
              )}
            />
            <Route path="/home" exact>
              <Redirect to="/" />
            </Route>
            <Route path="*" component={AsyncPageNotFound} />
          </Switch>
        </Router>
      </Suspense>
    </React.Fragment>
  );
};

export default Header;
