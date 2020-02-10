export const setFlightDetails = data => {
  return {
    type: "SETFLIGHTDETAILS",
    payload: data
  };
};

export const setUserDetails = data => {
  return {
    type: "SETUSERDETAILS",
    payload: data
  };
};
