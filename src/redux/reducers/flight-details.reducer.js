const flightDetails = (state = [], action) => {
  switch (action.type) {
    case "SETFLIGHTDETAILS":
      return action.payload;
    default:
      return state;
  }
};

export default flightDetails;
