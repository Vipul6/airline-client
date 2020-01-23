import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./home.scss";
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      flightsDetail: []
    };
  }
  componentDidMount() {
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
          isLoaded: true
        });
        console.log(err);
      });
  }
  getCardsData() {
    const flights = this.state.flightsDetail.map(data => {
      return (
        <Card
          key={data._id}
          className="card-view"
          onClick={() => console.log(data)}
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
  render() {
    return (
      <React.Fragment>
        {!this.state.isLoaded ? (
          <Spinner />
        ) : (
          <div className="flight-details">{this.getCardsData()}</div>
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
