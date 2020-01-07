import React from "react";
import { Menu, Icon, Form, Button, Modal, Input } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../Redux/Actions";

class Channels extends React.Component {
  state = {
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    loadedChannels: []
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });
  isFormEmpty = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  handleSubmit = () => {
    if (this.isFormEmpty(this.state)) {
      const key = firebase
        .database()
        .ref("channels")
        .push().key;
      const newChannel = {
        id: key,
        name: this.state.channelName,
        details: this.state.channelDetails,
        createdBy: {
          name: this.props.user.displayName,
          avatar: this.props.user.photoURL
        }
      };
      firebase
        .database()
        .ref("channels")
        .child(key)
        .update(newChannel)
        .then(() => {
          this.setState({ channelName: "", channelDetails: "" });
          this.closeModal();
          console.log("channel added");
        });
    } else {
      console.log("sh*t");
    }
  };

  componentDidMount() {
    this.addListners();
  }

  addListners = () => {
    const loadedChannels = [];
    firebase
      .database()
      .ref("channels")
      .on("child_added", snap => {
        loadedChannels.push(snap.val());
        this.setState({
          loadedChannels
        });
      });
  };

  displayChannels = channels =>
    channels.length
      ? channels.map(channel => (
          <Menu.Item
            key={channel.id}
            onClick={() => this.props.setCurrentChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
          >
            # {channel.name}
          </Menu.Item>
        ))
      : null;

  render() {
    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>
            &nbsp; ({this.state.loadedChannels.length}){" "}
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(this.state.loadedChannels)}
        </Menu.Menu>
        <Modal basic onClose={this.closeModal} open={this.state.modal}>
          <Modal.Header>Add Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  value={this.state.channelName}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  value={this.state.channelDetails}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" />
              Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentChannel: channel => dispatch(setCurrentChannel(channel))
  };
};

export default connect(null, mapDispatchToProps)(Channels);
