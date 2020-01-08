import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messages: [],
    messagesLoading: true
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

  addMessageListner = channelId => {
    const loadedMessages = [];
    console.log(channelId);
    firebase
      .database()
      .ref("messages")
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

  render() {
    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(this.state.messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          user={this.props.user}
          currentChannel={this.props.currentChannel}
          // messagesRef={firebase.database().ref("messages")}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
