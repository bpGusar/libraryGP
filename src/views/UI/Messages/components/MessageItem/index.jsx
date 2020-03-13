import React from "react";
import { Comment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import cn from "classnames";

import s from "./index.module.scss";

export default function MessageItem(props) {
  const {
    messageId,
    avatarSrc,
    selectedChat,
    messagesWhichIsNotUpload,
    firstName,
    message
  } = props;
  return (
    <div key={messageId} className={cn("comment", s.messageItem)}>
      <Comment.Avatar src={avatarSrc} />
      <Comment.Content>
        <Comment.Author as={Link} to={`/profile/${selectedChat.peer._id}`}>
          {messagesWhichIsNotUpload.find(el => el === message._id) && (
            <Icon loading name="spinner" />
          )}
          {firstName}
        </Comment.Author>
        <Comment.Metadata>
          <div>
            {DateTime.fromISO(message.createdAt)
              .setLocale("ru")
              .toFormat("hh:mm dd MMMM yyyy")}
          </div>
        </Comment.Metadata>
        <Comment.Text className={s.messageItemText}>
          {message.message}
        </Comment.Text>
      </Comment.Content>
    </div>
  );
}
