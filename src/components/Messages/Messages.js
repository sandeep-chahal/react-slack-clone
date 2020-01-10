import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messages: [],
    messagesLoading: true,
    searchTerm: "",
    searchLoading: false,
    searchResult: []
  };

  componentDidMount() {
    const { user, currentChannel } = this.props;
    if (user && currentChannel) {
      this.addListners(currentChannel.id);
    }
  }

  addListners = channelId => {
    this.addMessageListner(channelId);
  };

  getMessagesRef = () => {
    if (this.props.isPrivate) {
      return firebase.database().ref("privateMessages");
    } else {
      return firebase.database().ref("messages");
    }
  };

  addMessageListner = channelId => {
    const loadedMessages = [];

    this.getMessagesRef()
      .child(channelId)
      .on("child_added", snap => {
        loadedMessages.push(snap.val());
        // console.log(loadedMessages);
        this.setState({ messages: loadedMessages, messagesLoading: false });
      });
  };

  displayMessages = messages => {
    return (
      messages.length > 0 &&
      messages.map(message => (
        <Message
          key={message.timestamp}
          user={this.props.user}
          message={message}
        />
      ))
    );
  };

  displayChannelName = channel =>
    channel ? (this.props.isPrivate ? `@` : "#") + channel.name : "";

  numberOfUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) acc.push(message.user.name);
      return acc;
    }, []);
    const plural = uniqueUsers.length < 2 ? "" : "s";
    return uniqueUsers.length + " user" + plural;
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      this.handleSearchMessages
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResult = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResult });
  };

  render() {
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(this.props.currentChannel)}
          totalUsers={this.numberOfUsers(this.state.messages)}
          handleSearchChange={this.handleSearchChange}
          isPrivate={this.props.isPrivate}
        />
        <Segment>
          <Comment.Group className="messages">
            {this.state.searchTerm
              ? this.displayMessages(this.state.searchResult)
              : this.displayMessages(this.state.messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          user={this.props.user}
          currentChannel={this.props.currentChannel}
          isPrivate={this.props.isPrivate}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
