import React from "react";
import {
  Menu,
  Icon,
  Form,
  Button,
  Modal,
  Input,
  Label
} from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../Redux/Actions";

class Channels extends React.Component {
  state = {
    channel: null,
    messagesRef: firebase.database().ref("messages"),
    channelsRef: firebase.database().ref("channels"),
    notifications: [],
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    loadedChannels: [],
    firstLoad: true,
    activeChannel: ""
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

  componentWillUnmount() {
    this.removeListners();
  }

  addListners = () => {
    const loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ loadedChannels }, this.setFirstChannel);
      this.addNotificationListner(snap.key);
    });
  };

  addNotificationListner = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      this.handleNotifcations(
        channelId,
        this.state.activeChannel,
        this.state.notifications,
        snap
      );
    });
  };

  handleNotifcations = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }
    this.setState({ notifications });
  };

  removeListners = () => {
    firebase
      .database()
      .ref("channels")
      .off();
  };

  clearNotifications = channelId => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total =
        updatedNotifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  setFirstChannel = () => {
    const firstChannel = this.state.loadedChannels[0];
    if (this.state.firstLoad && firstChannel) {
      this.props.setCurrentChannel(firstChannel);
      this.setState({
        firstLoad: false,
        activeChannel: firstChannel.id,
        channel: firstChannel
      });
    }
  };

  setActiveChannel = channel => {
    this.setState({
      activeChannel: channel.id
    });
  };

  getNotificationCount = channel => {
    let count = 0;
    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) count = notification.count;
    });
    if (count > 0) return count;
  };

  displayChannels = channels =>
    channels.length
      ? channels.map(channel => (
          <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            active={channel.id === this.state.activeChannel}
            style={{ opacity: 0.7 }}
          >
            {this.getNotificationCount(channel) && (
              <Label color="red">{this.getNotificationCount(channel)}</Label>
            )}
            # {channel.name}
          </Menu.Item>
        ))
      : null;

  changeChannel = channel => {
    this.clearNotifications(channel.id);
    this.props.setCurrentChannel(channel);
    this.setActiveChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  render() {
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
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
    setCurrentChannel: channel => dispatch(setCurrentChannel(channel)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate))
  };
};

export default connect(null, mapDispatchToProps)(Channels);
