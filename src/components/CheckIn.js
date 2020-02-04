import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  Collapse,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";
import Axios from "axios";
import Snackbar from "./Snackbar";
import Spinner from "./Spinner";
import "../styles/check-in.scss";
import ChangeSeatDialog from "./ChangeSeatDialog";

const fliterIcon = require("../assets/svg/filter-list.svg");
const downArrowIcon = require("../assets/svg/down-arrow.svg");

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      showSnackbar: false,
      flightsDetail: [],
      flightId: null,
      filteredFlightData: [],
      showFilter: false,
      checkedIn: false,
      checkInRequired: false,
      wheelChair: false,
      infants: false,
      showDialog: false,
      dialogContent: null
    };
  }

  getFlightIndex = () => {
    return this.state.filteredFlightData.findIndex(
      flight => flight.id.toString() === this.state.flightId
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

  componentDidMount() {
    const routeParams = this.props.match.path;

    if (routeParams.includes("flights")) {
      this.props.updateActiveLink("flights");
    }

    if (!this.props.flightDetails.length) {
      Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
        .then(res => {
          this.props.getFlightDetails(res.data.data);
          this.setState(
            {
              flightsDetail: res.data.data,
              isLoaded: true,
              flightId: this.props.match.params.flightId,
              filteredFlightData: res.data.data
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
          flightId: this.props.match.params.flightId,
          filteredFlightData: this.props.flightDetails
        },
        () => this.checkValidFlightId()
      );
    }
  }

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

  getGridView = () => {
    const flightIndex = this.getFlightIndex();
    if (flightIndex > -1) {
      return this.state.flightsDetail[flightIndex].seatsDetail.map(
        (seat, index) => {
          return (
            <div key={seat.number} className="outer-grid">
              <div
                className={seat.isOccupied ? "seat-occupied" : "seat-vaccant"}
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

  getStatusIndicator = () => {
    return (
      <React.Fragment>
        <div className="status-wrapper">
          <div className="occupied-status">
            <div className="circle"></div>
            <span>Occupied</span>
          </div>
          <div className="vaccant-status">
            <div className="circle"></div>
            <span>Vaccant</span>
          </div>
        </div>
      </React.Fragment>
    );
  };

  getFilters = () => {
    return (
      <Card>
        <CardContent
          onClick={() => this.setState({ showFilter: !this.state.showFilter })}
          className="filter-card-content"
        >
          <div className="filter-card-header">
            <img src={fliterIcon} alt="filters" />
            <span className="filter-text">Filters</span>
            <div className="svg-container">
              <img
                className={this.state.showFilter ? "expanded" : "expand-more"}
                src={downArrowIcon}
                alt="expand-more"
              />
            </div>
          </div>
        </CardContent>
        <Collapse in={this.state.showFilter}>
          <CardContent className="filter-card-content">
            {this.getCheckboxes()}
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  performFilterOperation = (passengersList, filterName) => {
    return passengersList.filter(passenger => {
      let returnValue = null;
      if (filterName !== "checkedInRequired" && passenger[filterName]) {
        returnValue = passenger;
      } else if (filterName === "checkedInRequired" && !passenger.isCheckedIn) {
        returnValue = passenger;
      }
      return returnValue;
    });
  };

  applyFilters = () => {
    const flightIndex = this.getFlightIndex();
    let filteredPassengers = this.state.filteredFlightData[flightIndex]
      .passengersDetail;
    if (this.state.checkedIn) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "isCheckedIn"
      );
    }
    if (this.state.checkInRequired) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "checkedInRequired"
      );
    }

    if (this.state.infants) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "hasInfant"
      );
    }

    if (this.state.wheelChair) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "isWheelChairRequired"
      );
    }
    const filteredData = JSON.parse(JSON.stringify(this.state.flightsDetail));
    filteredData[flightIndex].passengersDetail = filteredPassengers;
    this.setState({
      filteredFlightData: filteredData
    });
  };

  updateCheckbox = name => event => {
    this.setState(
      {
        filteredFlightData: JSON.parse(
          JSON.stringify(this.state.flightsDetail)
        ),
        [name]: event.target.checked
      },
      () => {
        this.applyFilters();
      }
    );
  };

  getCheckboxes = () => {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={this.updateCheckbox("checkedIn")}
            />
          }
          label="Checked-in"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={this.updateCheckbox("checkInRequired")}
            />
          }
          label="Check-in required"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={this.updateCheckbox("wheelChair")}
            />
          }
          label="Wheel chair"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={this.updateCheckbox("infants")}
            />
          }
          label="Infants"
        />
      </FormGroup>
    );
  };

  hideDialog = () => {
    this.setState({
      showDialog: false
    });
  };

  getPassengersDetail = () => {
    const flightIndex = this.getFlightIndex();
    if (flightIndex > -1) {
      return this.state.filteredFlightData[flightIndex].passengersDetail.map(
        (passenger, index) => {
          return (
            <div key={passenger.id} className="passenger-detail">
              <span>{index + 1 + ". "}</span>
              <span
                className="passenger-name"
                onClick={() =>
                  this.checkSeatAvailability()
                    ? this.setState({
                        showDialog: true,
                        dialogContent: (
                          <ChangeSeatDialog
                            seatsDetail={
                              this.state.filteredFlightData[flightIndex]
                                .seatsDetail
                            }
                            passenger={passenger}
                            hideDialog={this.hideDialog}
                          />
                        )
                      })
                    : this.setState({
                        showDialog: false,
                        showSnackbar: true,
                        isLoaded: true,
                        snackbar: (
                          <Snackbar
                            message={"No seats are vacant."}
                            hideSnackbar={this.hideSnackbar}
                          />
                        )
                      })
                }
              >
                {passenger.name}
              </span>
              {passenger.seatNumber ? (
                <span className="seat-number">
                  {" " + passenger.seatNumber + " "}
                </span>
              ) : null}

              <span className="ancilliary-service">
                {passenger.ancilliaryServices.join(", ")}
              </span>
            </div>
          );
        }
      );
    }
  };

  checkSeatAvailability = () => {
    const flightIndex = this.getFlightIndex();
    const seats = this.state.filteredFlightData[flightIndex].seatsDetail.filter(
      seat => !seat.isOccupied
    );
    return seats.length ? true : false;
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
          <div className="check-in-container">
            <div className="status-container">{this.getStatusIndicator()}</div>
            <div className="check-in-view">
              <div className="grid-container">
                <h3 className="grid-text">Seat grid view</h3>
                <div className="grid-view">{this.getGridView()}</div>
              </div>
              <div className="passenger-container">
                <h3>Passengers list</h3>
                <div className="filter-card-container">{this.getFilters()}</div>
                <div className="passengers-list">
                  {this.getPassengersDetail()}
                </div>
              </div>
            </div>
            <React.Fragment>
              {this.state.showDialog ? this.state.dialogContent : null}
            </React.Fragment>
          </div>
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
    getFlightDetails: details =>
      dispatch({ type: "GETFLIGHTDETAILS", payload: details })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckIn);
