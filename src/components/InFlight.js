import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import Snackbar from "./Snackbar";
import Spinner from "./Spinner";
import ServiceUpdateDialog from "./ServiceUpdateDialog";
import "../styles/in-flight.scss";
import { Divider } from "@material-ui/core";

const flightTakeoffIcon = require("../assets/svg/flight-takeoff.svg");
const flightLandIcon = require("../assets/svg/flight-land.svg");

class InFlight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      showSnackbar: false,
      flightsDetail: [],
      flightId: null,
      showServiceDialog: false,
      serviceDialogContent: null
    };
  }

  componentDidMount() {
    const routeParams = this.props.match.path;

    if (routeParams.includes("flights")) {
      this.props.updateActiveLink("flights");
    }

    if (!this.props.flightDetails.length) {
      Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
        .then(res => {
          this.props.setFlightDetails(res.data.data);
          this.setState(
            {
              flightsDetail: res.data.data,
              isLoaded: true,
              flightId: this.props.match.params.flightId
            },
            () => this.checkValidFlightId()
          );
        })
        .catch(err => {
          this.setSnackbarMessage(
            "Server is down, Please try again after sometime."
          );
        });
    } else {
      this.setState(
        {
          flightsDetail: this.props.flightDetails,
          isLoaded: true,
          flightId: this.props.match.params.flightId
        },
        () => this.checkValidFlightId()
      );
    }
  }

  getFlightIndex = () => {
    return this.state.flightsDetail.findIndex(
      flight => flight._id.toString() === this.state.flightId
    );
  };

  checkValidFlightId = () => {
    const index = this.getFlightIndex();
    if (index < 0) {
      this.setSnackbarMessage("Invalid action");
      setTimeout(() => {
        this.props.history.push("/flights");
      }, 1500);
    }
  };

  getGridView = () => {
    const flightIndex = this.getFlightIndex();
    if (flightIndex > -1) {
      return this.state.flightsDetail[flightIndex].seatsDetail.map(
        (seat, index) => {
          return (
            <div key={seat.number} className="outer-grid">
              <div
                className={
                  seat.isOccupied
                    ? this.isMealPreference(
                        this.state.flightsDetail[
                          flightIndex
                        ].passengersDetail.filter(
                          passenger => passenger._id === seat.passengerId
                        )
                      )
                      ? "special"
                      : "normal"
                    : "seat-vaccant"
                }
                onClick={() =>
                  this.updateServices(
                    this.state.flightsDetail[flightIndex],
                    seat.passengerId
                  )
                }
              >
                <div className="seat-details">
                  <span>{seat.number}</span>
                </div>
              </div>
            </div>
          );
        }
      );
    }
  };

  updateServices = (flightDetail, passengerId) => {
    const passengerIndex = flightDetail.passengersDetail.findIndex(
      passenger => passenger._id === passengerId
    );
    this.setState({
      showServiceDialog: true,
      serviceDialogContent: (
        <ServiceUpdateDialog
          passenger={flightDetail.passengersDetail[passengerIndex]}
          flightDetail={flightDetail}
          hideServiceDialog={this.hideServiceDialog}
          errorCloseDialog={this.errorCloseDialog}
          successCloseDialog={this.successCloseDialog}
        />
      )
    });
  };

  hideServiceDialog = () => {
    this.setState({
      showServiceDialog: false,
      flightsDetail: this.props.flightDetails
    });
  };

  errorCloseDialog = () => {
    this.setState({
      showServiceDialog: false,
      showSnackbar: true,
      isLoaded: true,
      snackbar: (
        <Snackbar
          message={"Something went wrong. Please try again."}
          hideSnackbar={this.hideSnackbar}
        />
      )
    });
  };

  successCloseDialog = msg => {
    this.setState({
      showSnackbar: true,
      isLoaded: true,
      snackbar: (
        <Snackbar
          message={msg}
          alertType="success"
          hideSnackbar={this.hideSnackbar}
        />
      )
    });
  };

  isMealPreference = passengerDetail => {
    return passengerDetail[0]?.meals.length ? true : false;
  };

  getStatusIndicator = () => {
    return (
      <React.Fragment>
        <div className="status-wrapper">
          <div className="vaccant-status">
            <div className="circle"></div>
            <span>Vaccant</span>
          </div>
          <div className="special-status">
            <div className="circle"></div>
            <span>Special meals</span>
          </div>
          <div className="normal-status">
            <div className="circle"></div>
            <span>No meals</span>
          </div>
        </div>
      </React.Fragment>
    );
  };

  setSnackbarMessage = msg => {
    this.setState({
      showSnackbar: true,
      isLoaded: true,
      snackbar: <Snackbar message={msg} hideSnackbar={this.hideSnackbar} />
    });
  };

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false
    });
  };

  getFlightDetailView = () => {
    const index = this.getFlightIndex();
    const data = this.state.flightsDetail[index];
    return (
      <React.Fragment>
        <Divider className="material-divider" />
        <div className="card-view">
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
          </div>
        </div>
        <Divider />
      </React.Fragment>
    );
  };
  render() {
    return (
      <React.Fragment>
        <div className="snackbar-alignment">
          {this.state.showSnackbar ? this.state.snackbar : null}
        </div>
        {!this.state.isLoaded ? (
          <Spinner />
        ) : this.state.flightsDetail.length ? (
          <div className="in-flight-container">
            <div className="status-container">{this.getStatusIndicator()}</div>
            <React.Fragment>{this.getFlightDetailView()}</React.Fragment>
            <div className="in-flight-view">
              <div className="grid-container">
                <h3 className="grid-text">Seat grid view</h3>
                <div className="grid-view">{this.getGridView()}</div>
              </div>
            </div>

            <React.Fragment>
              {this.state.showServiceDialog
                ? this.state.serviceDialogContent
                : null}
            </React.Fragment>
          </div>
        ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(InFlight);
