import React, { useEffect, useState } from "react";
import Axios from "axios";
import Snackbar from "./Snackbar";
import { setUserDetails } from "../redux/actions";
import { useDispatch } from "react-redux";

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

  return (
    <React.Fragment>
      <div className="snackbar-alignment">
        {snackbar.showSnackbar ? snackbar.snackbarContent : null}
      </div>
      <div>Home</div>
    </React.Fragment>
  );
};

export default Home;
