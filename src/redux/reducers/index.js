import { combineReducers } from "redux";
import flightDetails from "./flight-details.reducer";

const rootReducer = combineReducers({ flightDetails });

export default rootReducer;
