import React from "react";
import { Menu } from "semantic-ui-react";
import UserPannel from "./UserPannel/UserPannel";
import Channels from "./Channels";
import DirectMessages from "../Messages/DirectMessages";
const SidePannel = ({ user }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPannel user={user} />
      <Channels user={user} />
      <DirectMessages user={user} />
    </Menu>
  );
};

export default SidePannel;
