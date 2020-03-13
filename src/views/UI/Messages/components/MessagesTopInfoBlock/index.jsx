import React from "react";
import { Comment, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";

import s from "./index.module.scss";

export default function MessagesTopInfoBlock(props) {
  const { selectedChat } = props;
  return (
    <div className={s.messagesBlockTopInfo}>
      <Comment.Group className={s.recipientBlock}>
        <Comment>
          <Comment.Avatar
            className={s.recipientBlockAvatar}
            src={selectedChat.peer.avatar}
          />
          <Comment.Content className={s.recipientBlockContent}>
            <Comment.Author as={Link} to={`/profile/${selectedChat.peer._id}`}>
              {selectedChat.peer.firstName} {selectedChat.peer.lastName}{" "}
              {selectedChat.peer.patronymic}
            </Comment.Author>
          </Comment.Content>
        </Comment>
      </Comment.Group>
      <Divider className={s.divider} />
    </div>
  );
}
