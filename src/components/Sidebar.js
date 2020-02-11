import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router-dom";
import "../styles/sidebar.scss";

const SideBar = props => {
  const icons = [
    require("../assets/svg/home-logo.svg"),
    require("../assets/svg/flight-logo.svg"),
    require("../assets/svg/business-logo.svg")
  ];
  const history = useHistory();

  const handleClick = location => {
    history.push(`/${location}`);
  };

  const sideList = () => (
    <div
      className="sidebar"
      role="presentation"
      onClick={props.hideSidebar}
      onKeyDown={props.hideSidebar}
    >
      <List>
        {["Home", "Flights", "About"].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={() => handleClick(text.toLowerCase())}
          >
            <ListItemIcon>
              <img src={icons[index]} alt={text} />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer anchor="right" open={true} onClose={props.hideSidebar}>
        {sideList()}
      </Drawer>
    </div>
  );
};

export default SideBar;
