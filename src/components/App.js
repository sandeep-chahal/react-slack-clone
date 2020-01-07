import React from "react";
import "./App.css";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import ColorPannel from "./ColorPannel/ColorPannel";
import MetaPannel from "./MetaPannel/MetaPannel";
import Messages from "./Messages/Messages";
import SidePannel from "./SidePannel/SidePannel";

function App({ user }) {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPannel />
      <SidePannel user={user} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPannel />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user.user
  };
};

export default connect(mapStateToProps)(App);
