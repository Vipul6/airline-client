import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Spinner from "./Spinner";
import "./app.scss";
const AsyncHome = lazy(() => import("./Home"));
const AsyncAbout = lazy(() => import("./About"));
const AsyncContact = lazy(() => import("./Contact"));

const App = () => {
  const [activeLink, setActiveLink] = useState("");
  return (
    <React.Fragment>
      <Suspense fallback={<Spinner />}>
        <Router>
          <header className="nav-container">
            <div className="navbar">
              <Link to="/" className="logo" onClick={() => setActiveLink("home")}>
                {/* <img src={} />  */}
                Cruzer Airlines
              </Link>
              <nav className="nav-links-container">
                <Link
                  onClick={() => setActiveLink("home")}
                  className={activeLink === "home" ? "active-link" : "links"}
                  to="/"
                >
                  Home
                  {activeLink === "home" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
                <Link
                  onClick={() => setActiveLink("about")}
                  className={activeLink === "about" ? "active-link" : "links"}
                  to="/about"
                >
                  About
                  {activeLink === "about" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
                <Link
                  onClick={() => setActiveLink("contact")}
                  className={activeLink === "contact" ? "active-link" : "links"}
                  to="/contact"
                >
                  Contact
                  {activeLink === "contact" ? (
                    <span className="active-bar"></span>
                  ) : null}
                </Link>
              </nav>
            </div>
          </header>
          <Switch>
            <Route exact path="/" component={AsyncHome} />
            <Route path="/about" component={AsyncAbout} />
            <Route path="/contact" component={AsyncContact} />
          </Switch>
        </Router>
      </Suspense>
    </React.Fragment>
  );
};

export default App;
