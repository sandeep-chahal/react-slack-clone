import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const isOwnMessage = (msgUserId, userUid) =>
  msgUserId === userUid ? "message__self" : "";

const isImage = message =>
  message.hasOwnProperty("fileUrl") && !message.hasOwnProperty("content");

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => {
  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message.user.id, user.uid)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? (
          <Image src={message.fileUrl} className="message__image" />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};
export default Message;
