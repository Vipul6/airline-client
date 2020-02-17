import React, { useEffect, useState } from "react";
import Axios from "axios";
import Snackbar from "./Snackbar";
import { setUserDetails } from "../redux/actions";
import { useDispatch } from "react-redux";
import "../styles/home.scss";

const imgArray = [
  require("../assets/images/mysore-destination.jpg"),
  require("../assets/images/goa-destination.jpg"),
  require("../assets/images/shimla-destination.jpg"),
  require("../assets/images/jaipur-destination.jpg"),
  require("../assets/images/mumbai-destination.jpg"),
  require("../assets/images/delhi-destination.jpg"),
  require("../assets/svg/search.svg"),
  require("../assets/svg/wallet.svg"),
  require("../assets/svg/dollar.svg"),
  require("../assets/svg/instant.svg")
];

const Home = props => {
  const [snackbar, updateSnackbar] = useState({ showSnackbar: false });
  const dispatch = useDispatch();

  const hideSnackbar = () => {
    updateSnackbar({
      showSnackbar: false
    });
  };

  const googleId = props.location.search;
  useEffect(() => {
    if (googleId) {
      Axios.get(
        `${process.env.REACT_APP_BASE_URL}auth/users?id=${googleId.substr(8)}`
      )
        .then(res => {
          const user = res.data.data;
          sessionStorage.setItem("userName", user.name);
          sessionStorage.setItem("id", user.id);
          sessionStorage.setItem("role", "Staff");
          dispatch(setUserDetails(sessionStorage));

          updateSnackbar({
            showSnackbar: true,
            snackbarContent: (
              <Snackbar
                message={`Welcome ${user.name}.`}
                alertType="success"
                hideSnackbar={hideSnackbar}
              />
            )
          });
        })
        .catch(err => {
          sessionStorage.removeItem("userName");
          sessionStorage.removeItem("id");
          sessionStorage.removeItem("role");

          let errorMessage = "Server is down, Please try again after sometime.";
          if (err.response && err.response.status === 401) {
            errorMessage = "Not authorized";
          }
          updateSnackbar({
            showSnackbar: true,
            snackbarContent: (
              <Snackbar message={errorMessage} hideSnackbar={hideSnackbar} />
            )
          });
        });
    } else if (sessionStorage.length && sessionStorage.id) {
      dispatch(setUserDetails(sessionStorage));
    }
  }, [googleId, dispatch]);

  const routeParams = props.match.path;

  if (routeParams === "/") {
    props.updateActiveLink("home");
  }

  const destinations = () => {
    return (
      <div className="destination-wrapper">
        <div className="destination-content">
          <div className="img-content">
            <img
              loading="eager"
              src={imgArray[0]}
              alt="Mysore"
              className="dest-img"
            />
            <span className="dest-label">Mysore</span>
          </div>
          <div className="img-content">
            <img
              loading="eager"
              src={imgArray[1]}
              alt="Goa"
              className="dest-img"
            />
            <span className="dest-label">Goa</span>
          </div>
        </div>

        <div className="destination-content">
          <div className="img-content">
            <img
              loading="eager"
              src={imgArray[2]}
              alt="Shimla"
              className="dest-img"
            />
            <span className="dest-label">Shimla</span>
          </div>
          <div className="img-content">
            <img
              loading="eager"
              src={imgArray[3]}
              alt="Jaipur"
              className="dest-img"
            />
            <span className="dest-label">Jaipur</span>
          </div>
        </div>

        <div className="destination-content">
          <div className="img-content">
            <img
              loading="eager"
              src={imgArray[4]}
              alt="Mumbai"
              className="dest-img"
            />
            <span className="dest-label">Mumbai</span>
          </div>
          <div className="img-content">
            <img
              loading="eager"
              src={imgArray[5]}
              alt="Delhi"
              className="dest-img"
            />
            <span className="dest-label">Delhi</span>
          </div>
        </div>
      </div>
    );
  };

  const topContent = () => {
    return (
      <div className="bottom-content-wrapper">
        <div className="company-content">
          <img
            loading="eager"
            src={imgArray[6]}
            alt="search"
            className="svg-icon"
          ></img>
          <span className="benefits">Look no further</span>
          <span>Search all online travel deals in one go</span>
        </div>
        <div className="company-content">
          <img
            loading="eager"
            src={imgArray[7]}
            alt="wallet"
            className="svg-icon"
          ></img>
          <span className="benefits">Shop with confidence</span>
          <span>No hidden fees, taxes or other nasty surprises</span>
        </div>
        <div className="company-content">
          <img
            loading="eager"
            src={imgArray[8]}
            alt="money"
            className="svg-icon"
          ></img>
          <span className="benefits">Pay the way you want</span>
          <span>See only sellers who support your preferred methods</span>
        </div>
        <div className="company-content">
          <img
            loading="eager"
            src={imgArray[9]}
            alt="instant"
            className="svg-icon"
          ></img>
          <span className="benefits">Instant booking</span>
          <span>For selected sellers, book with just a couple of clicks</span>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="snackbar-alignment">
        {snackbar.showSnackbar ? snackbar.snackbarContent : null}
      </div>
      <React.Fragment>
        <span className="destination-title">Why Cruzer Airlines?</span>
        {topContent()}
      </React.Fragment>
      <React.Fragment>
        <span className="destination-title">
          Top popular destination in India
        </span>
        {destinations()}
      </React.Fragment>
    </React.Fragment>
  );
};

export default Home;
