import React from "react";
import { Segment, Button, Input, Progress } from "semantic-ui-react";
import firebase from "firebase";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  state = {
    message: "",
    loading: false,
    errors: [],
    modal: false,
    errors: [],
    uploadState: "",
    percentageUploaded: 0
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.props.user.uid,
        name: this.props.user.displayName,
        avatar: this.props.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message.fileUrl = fileUrl;
    } else {
      message.content = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { currentChannel } = this.props;
    const { message } = this.state;
    if (message) {
      this.setState({ loading: true });
      this.props
        .getMessagesRef()
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  getPath = () => {
    if (this.props.isPrivate) {
      return `chat/private=${this.props.currentChannel.id}`;
    } else {
      return "chat/public";
    }
  };

  uploadFile = (file, metadata) => {
    const channelToUplaod = this.props.currentChannel.id;
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
    // path to uplaod file with random name
    const storageRef = firebase.storage().ref(filePath);

    // uploading file
    const task = storageRef.put(file, metadata);

    // event listners
    task.on(
      "state_changed",
      snap => {
        // snapshot while uplaoding
        var percentage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        this.setState({ percentageUploaded: percentage });
        this.setState({ uploadState: "uploading" });
      },
      err => {
        // error while uplaoding
        console.log(err);
        this.setState({
          errors: this.state.errors.concat(err),
          uploadState: "error"
        });
      },
      () => {
        // succesfully uploaded
        this.setState({ uploadState: "uploaded" });
        // after uploading get url and send it as message
        task.snapshot.ref.getDownloadURL().then(url => {
          this.sendFileMessage(url, channelToUplaod);
        });
      }
    );
  };

  sendFileMessage = (url, channelToUplaod) => {
    this.props
      .getMessagesRef()
      .child(channelToUplaod)
      .push()
      .set(this.createMessage(url))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.log(err);
        this.setState({ errors: this.state.errors.concat(err) });
      });
  };

  render() {
    return (
      <Segment className={"message__form"}>
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.handleChange}
          value={this.state.message}
          className={
            this.state.errors.some(error =>
              error.message.toLowerCase().includes("message")
            )
              ? "error"
              : ""
          }
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            disabled={this.state.loading}
          />
          <Button
            color="teal"
            disabled={this.state.uploadState === "uploading"}
            content="Uplaod Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          uploadFile={this.uploadFile}
          modal={this.state.modal}
          closeModal={this.closeModal}
        />
        <ProgressBar
          uploadState={this.state.uploadState}
          percentageUploaded={this.state.percentageUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
