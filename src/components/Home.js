import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "./Snackbar";
import "../styles/home.scss";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      flightsDetail: [],
      hasApiError: false,
      showSnackbar: false
    };
  }
  componentDidMount() {
    const googleId = this.props.location.search;

    if (googleId) {
      Axios.get(
        `${process.env.REACT_APP_BASE_URL}auth/users?id=${googleId.substr(8)}`
      )
        .then(res => {
          const user = res.data.data;
          sessionStorage.setItem("userName", user.name);
          sessionStorage.setItem("id", user.id);

          this.setState({
            showSnackbar: true,
            snackbar: (
              <Snackbar
                message={`Welcome ${user.name}.`}
                alertType="success"
                hideSnackbar={this.hideSnackbar}
              />
            )
          });
        })
        .catch(err => {
          sessionStorage.removeItem("userName");
          sessionStorage.removeItem("id");
          let errorMessage = "Server is down, Please try again after sometime.";
          if (err.response && err.response.status === 401) {
            errorMessage = "Not authorized";
          }
          this.setState({
            showSnackbar: true,
            snackbar: (
              <Snackbar
                message={errorMessage}
                hideSnackbar={this.hideSnackbar}
              />
            )
          });
        });
    }

    const routeParams = this.props.match.path;

    if (routeParams === "/") {
      this.props.updateActiveLink("home");
    }

    Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
      .then(res => {
        this.props.getFlightDetails(res.data.data);
        this.setState({
          flightsDetail: res.data.data,
          isLoaded: true
        });
      })
      .catch(err => {
        this.setState({
          isLoaded: true,
          showSnackbar: true,
          snackbar: (
            <Snackbar
              message="Server is down, Please try again after sometime."
              hideSnackbar={this.hideSnackbar}
            />
          )
        });
      });
  }

  checkAuthorization = () => {
    const id = sessionStorage.getItem("id");
    if (!id) {
      this.setState({
        showSnackbar: true,
        snackbar: (
          <Snackbar
            message="Please login first."
            hideSnackbar={this.hideSnackbar}
          />
        )
      });
    }
  };

  getCardsData() {
    const flights = this.state.flightsDetail.map(data => {
      return (
        <Card
          key={data._id}
          className="card-view"
          onClick={this.checkAuthorization}
        >
          <CardContent>
            <p>Souce: {data.source} </p>
            <p>Destination: {data.destination}</p>
          </CardContent>
        </Card>
      );
    });
    return flights;
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
    getFlightDetails: details =>
      dispatch({ type: "GETFLIGHTDETAILS", payload: details })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
