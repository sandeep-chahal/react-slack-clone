import React from "react";
import { Modal, Button, Input, Icon } from "semantic-ui-react";

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"]
  };
  addFile = e => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = () => {
    const { file, authorized } = this.state;
    if (file !== null && authorized.includes(file.type)) {
      const metadata = { contentType: file.type };
      this.props.uploadFile(file, metadata);
      this.props.closeModal();
      this.setState({ file: null });
    } else {
      console.log("can't send");
    }
  };
  render() {
    return (
      <Modal basic open={this.props.modal} onClose={this.props.closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" />
            Send
          </Button>
          <Button color="red" inverted onClick={this.props.closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
