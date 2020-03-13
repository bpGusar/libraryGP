import React from "react";
import { List, Image } from "semantic-ui-react";
import cn from "classnames";

import s from "./index.module.scss";

export default function ChatItem(props) {
  const { chatId, onItemClick, selectedChat, chat, currentUser } = props;
  return (
    <List.Item
      key={chatId}
      onClick={() => onItemClick()}
      className={cn(s.userListItem, selectedChat._id === chat._id && s.active)}
    >
      <Image avatar src={chat.peer.avatar} />
      <List.Content>
        <List.Header>
          {chat.peer.firstName} {chat.peer.lastName} {chat.peer.patronymic}
        </List.Header>
        <List.Description>
          <b>
            {chat.lastMessage.from === currentUser._id
              ? "вы: "
              : `${chat.peer.firstName}: `}
          </b>
          {chat.lastMessage.message.substring(0, 20)}
          {chat.lastMessage.message.length > 20 && "..."}
        </List.Description>
      </List.Content>
    </List.Item>
  );
}
