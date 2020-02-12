import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import { Card, Collapse, CardContent, Button } from "@material-ui/core";
import Snackbar from "./Snackbar";
import "../styles/flight.scss";

const downArrowIcon = require("../assets/svg/down-arrow.svg");
const flightTakeoffIcon = require("../assets/svg/flight-takeoff.svg");
const flightLandIcon = require("../assets/svg/flight-land.svg");

class Flight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      flightsDetail: [],
      showSnackbar: false,
      expandedId: null
    };
  }
  componentDidMount() {
    const routeParams = this.props.match.path;

    if (routeParams === "/flights") {
      this.props.updateActiveLink("flights");
    }
    if (!this.props.flightDetails.length) {
      Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
        .then(res => {
          this.props.setFlightDetails(res.data.data);
          this.setState({
            flightsDetail: res.data.data,
            isLoaded: true
          });
        })
        .catch(err => {
          this.setSnackbarMessage(
            "Server is down, Please try again after sometime."
          );
        });
    } else {
      this.setState({
        flightsDetail: this.props.flightDetails,
        isLoaded: true
      });
    }
  }

  checkAuthorization = () => {
    const id = sessionStorage.getItem("id");
    const returnValue = id ? true : false;
    return returnValue;
  };

  setSnackbarMessage = msg => {
    this.setState({
      showSnackbar: true,
      isLoaded: true,
      snackbar: <Snackbar message={msg} hideSnackbar={this.hideSnackbar} />
    });
  };

  updateExpansion = id => {
    if (this.state.expandedId && this.state.expandedId === id) {
      this.setState({
        expandedId: null
      });
    } else {
      this.setState({
        expandedId: id
      });
    }
  };

  getCardContent = data => {
    return (
      <CardContent>
        <div className="accordion-container">
          {sessionStorage.role === "Admin" ? (
            <div className="accordion-admin-action-btn">
              <Button
                onClick={() => {
                  if (this.checkAuthorization()) {
                    this.props.history.push(
                      `flights/${data._id}/manage-passengers`
                    );
                  } else {
                    this.setSnackbarMessage("Please login first.");
                  }
                }}
                variant="outlined"
                color="primary"
              >
                Manage passengers
              </Button>
              <Button
                onClick={() => {
                  if (this.checkAuthorization()) {
                    this.props.history.push(
                      `flights/${data._id}/manage-services`
                    );
                  } else {
                    this.setSnackbarMessage("Please login first.");
                  }
                }}
                variant="outlined"
                color="secondary"
              >
                Manage services
              </Button>
            </div>
          ) : (
            <div className="accordion-action-btn">
              <Button
                onClick={() => {
                  if (this.checkAuthorization()) {
                    this.props.history.push(`flights/${data._id}/check-in`);
                  } else {
                    this.setSnackbarMessage("Please login first.");
                  }
                }}
                variant="outlined"
                color="primary"
              >
                Check in
              </Button>
              <Button
                onClick={() => {
                  if (this.checkAuthorization()) {
                    this.props.history.push(`flights/${data._id}/in-flight`);
                  } else {
                    this.setSnackbarMessage("Please login first.");
                  }
                }}
                variant="outlined"
                color="secondary"
              >
                In flight
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    );
  };

  getCardsData() {
    return this.state.flightsDetail.map(data => {
      return (
        <Card key={data._id} className="card-view">
          <CardContent
            className="material-card-content"
            onClick={() => this.updateExpansion(data._id)}
          >
            <div className="card-content-container">
              <div className="card-content">
                <div className="top-view">
                  <div className="top-view-content">
                    <h4>{data.name}</h4>
                  </div>
                </div>
                <div className="card-view-content">
                  <div className="left-view">
                    <span className="flight-content-detail">
                      <h4>Source:</h4> <span>{data.source}</span>
                    </span>
                    <span className="flight-content-detail">
                      <h4>Departure time:</h4> <span>{data.departureTime}</span>
                      <img
                        src={flightTakeoffIcon}
                        alt="flight-takeoff"
                        className="flight-icon"
                      />
                    </span>
                  </div>
                  <div className="middle-view">
                    <span className="flight-content-detail">
                      <h4>Duration:</h4> <span>{data.duration}</span>
                    </span>
                  </div>
                  <div className="right-view">
                    <span className="flight-content-detail">
                      <h4>Destination:</h4> <span>{data.destination}</span>
                    </span>
                    <span className="flight-content-detail">
                      <h4>Arrival time:</h4> <span>{data.arrivalTime}</span>
                      <img
                        src={flightLandIcon}
                        alt="flight-land"
                        className="flight-icon"
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="svg-container">
                <img
                  className={
                    this.state.expandedId === data._id
                      ? "expanded"
                      : "expand-more"
                  }
                  src={downArrowIcon}
                  alt="expand-more"
                />
              </div>
            </div>
          </CardContent>

          <Collapse
            in={this.state.expandedId === data._id}
            timeout="auto"
            unmountOnExit
          >
            {this.getCardContent(data)}
          </Collapse>
        </Card>
      );
    });
  }

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="snackbar-alignment">
          {this.state.showSnackbar ? this.state.snackbar : null}
        </div>
        {!this.state.isLoaded ? (
          <Spinner />
        ) : (
          <div className="flight-details">{this.getCardsData()} </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { flightDetails } = state;
  return { flightDetails };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setFlightDetails: details =>
      dispatch({ type: "SETFLIGHTDETAILS", payload: details })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Flight);
