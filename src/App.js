import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
const AsyncHome = lazy(() => import("./components/Home"));
const AsyncAbout = lazy(() => import("./components/About"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
        <Switch>
          <Route exact path="/" component={AsyncHome} />
          <Route path="/about" component={AsyncAbout} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
