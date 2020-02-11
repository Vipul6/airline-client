import React, { Component } from "react";
import Axios from "axios";
import Snackbar from "./Snackbar";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import "../styles/manage-passengers.scss";
import {
  Card,
  Collapse,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button
} from "@material-ui/core";
import UpdatePassengerDialog from "./UpdatePassengerDialog";
import AddPassengerDialog from "./AddPassengerDialog";

const fliterIcon = require("../assets/svg/filter-list.svg");
const downArrowIcon = require("../assets/svg/down-arrow.svg");

class ManagePassengers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      showSnackbar: false,
      flightsDetail: [],
      flightId: null,
      filteredFlightData: [],
      showFilter: false,
      passportNumber: false,
      address: false,
      dateOfBirth: false,
      showUpdateDialog: false,
      showAddDialog: false
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

  getFlightIndex = () => {
    return this.state.filteredFlightData.findIndex(
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

  setSnackbarMessage = msg => {
    this.setState({
      showSnackbar: true,
      isLoaded: true,
      snackbar: <Snackbar message={msg} hideSnackbar={this.hideSnackbar} />
    });
  };

  hideUpdateDialog = () => {
    this.setState({
      showUpdateDialog: false,
      flightsDetail: this.props.flightDetails,
      filteredFlightData: this.props.flightDetails
    });
  };

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false
    });
  };

  hideFilters = () => {
    this.setState({
      showFilter: false,
      passportNumber: false,
      address: false,
      dateOfBirth: false
    });
  };

  performFilterOperation = (passengersList, filterName) => {
    return passengersList.filter(passenger => !passenger[filterName]);
  };

  applyFilters = () => {
    const flightIndex = this.getFlightIndex();
    let filteredPassengers = this.state.filteredFlightData[flightIndex]
      .passengersDetail;
    if (this.state.passportNumber) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "passportNumber"
      );
    }
    if (this.state.address) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "address"
      );
    }

    if (this.state.dateOfBirth) {
      filteredPassengers = this.performFilterOperation(
        filteredPassengers,
        "dateOfBirth"
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
              checked={this.state.passportNumber}
              onChange={this.updateCheckbox("passportNumber")}
            />
          }
          label="Passport"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={this.state.address}
              onChange={this.updateCheckbox("address")}
            />
          }
          label="Address"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={this.state.dateOfBirth}
              onChange={this.updateCheckbox("dateOfBirth")}
            />
          }
          label="Date of birth"
        />
      </FormGroup>
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

  getPassengersDetail = () => {
    const flightIndex = this.getFlightIndex();
    if (flightIndex > -1) {
      return this.state.filteredFlightData[flightIndex].passengersDetail.map(
        (passenger, index) => {
          return (
            <div key={passenger._id} className="passenger-detail">
              <span>{index + 1 + ". "}</span>
              <span
                className="passenger-name"
                onClick={() =>
                  this.setState({
                    showUpdateDialog: true,
                    updateDialogContent: (
                      <UpdatePassengerDialog
                        flightDetail={
                          this.state.filteredFlightData[flightIndex]
                        }
                        passenger={passenger}
                        hideUpdateDialog={this.hideUpdateDialog}
                        hideFilters={this.hideFilters}
                        errorCloseDialog={this.errorCloseDialog}
                        successCloseDialog={this.successCloseDialog}
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

  errorCloseDialog = () => {
    this.setState({
      showUpdateDialog: false,
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

  hideAddDialog = () => {
    this.setState({
      showAddDialog: false,
      flightsDetail: this.props.flightDetails,
      filteredFlightData: this.props.flightDetails
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
          <div className="manage-passengers-container">
            <div className="passenger-container">
              <h3>Passengers list</h3>
              <div className="filter-card-container">{this.getFilters()}</div>
              <div className="passengers-list">
                {this.getPassengersDetail()}
              </div>
              <Button
                color="secondary"
                onClick={() =>
                  this.setState({
                    showAddDialog: true,
                    addDialogContent: (
                      <AddPassengerDialog
                        hideAddDialog={this.hideAddDialog}
                        flightDetail={
                          this.state.flightsDetail[this.getFlightIndex()]
                        }
                        errorCloseDialog={this.errorCloseDialog}
                        successCloseDialog={this.successCloseDialog}
                      />
                    )
                  })
                }
              >
                Add passenger
              </Button>
            </div>
          </div>
        )}
        <React.Fragment>
          {this.state.showUpdateDialog ? this.state.updateDialogContent : null}
        </React.Fragment>
        <React.Fragment>
          {this.state.showAddDialog ? this.state.addDialogContent : null}
        </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePassengers);
