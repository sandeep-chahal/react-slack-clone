import React from "react";
import "./App.css";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import ColorPanel from "./ColorPanel/ColorPanel";
import MetaPannel from "./MetaPannel/MetaPannel";
import Messages from "./Messages/Messages";
import SidePannel from "./SidePannel/SidePannel";

function App({ user, currentChannel, isPrivate }) {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePannel user={user} key={user && user.uid} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          user={user}
          currentChannel={currentChannel}
          key={currentChannel && currentChannel.id}
          isPrivate={isPrivate}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPannel />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    currentChannel: state.channel.currentChannel,
    isPrivate: state.channel.isPrivate
  };
};

export default connect(mapStateToProps)(App);
