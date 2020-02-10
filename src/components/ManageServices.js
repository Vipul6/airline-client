import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import Snackbar from "./Snackbar";
import { setFlightDetails } from "../redux/actions";
import Spinner from "./Spinner";

const ManageServices = props => {
  const [snackbar, updateSnackbar] = useState({ showSnackbar: false });
  const [loaded, updateLoaded] = useState(false);
  const flightDetails = useSelector(state => state.flightDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    const routeParams = props.match.path;
    if (routeParams.includes("flights")) {
      props.updateActiveLink("flights");
    }

    if (!flightDetails.length) {
      serviceCall();
    } else {
      updateLoad();
    }
    return;
  });

  const updateLoad = () => {
    updateLoaded(true);
  };

  const serviceCall = () => {
    Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
      .then(res => {
        dispatch(setFlightDetails(res.data.data));
        updateLoaded(true);
      })
      .catch(err => {
        updateLoaded(true);
        setSnackbarMessage("Server is down, Please try again after sometime.");
      });
  };

  const setSnackbarMessage = msg => {
    updateSnackbar({
      showSnackbar: true,
      snackbarContent: <Snackbar message={msg} hideSnackbar={hideSnackbar} />
    });
  };

  const hideSnackbar = () => {
    updateSnackbar({
      showSnackbar: false
    });
  };

  return (
    <React.Fragment>
      <div className="snackbar-alignment">
        {snackbar.showSnackbar ? snackbar.snackbarContent : null}
      </div>
      {!loaded ? <Spinner /> : <div>aidiapd </div>}
    </React.Fragment>
  );
};

export default ManageServices;
