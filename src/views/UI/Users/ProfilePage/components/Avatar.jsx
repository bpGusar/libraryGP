import React, { Component } from "react";
import { Image, Card, Button, Dimmer, Divider } from "semantic-ui-react";
import { DateTime } from "luxon";

export default class Avatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAvatarLoading: false,
      active: false
    };

    this.avatarInputRef = React.createRef();
  }

  handleShow = () => this.setState({ active: true });

  handleHide = () => this.setState({ active: false });

  editAvatar = e => {
    e.preventDefault();

    const { onChange } = this.props;

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      onChange(reader.result);
    };

    reader.readAsDataURL(file);
  };

  render() {
    const { active, isAvatarLoading } = this.state;
    const { user, oldAvatar, onCancelChange, onSave, onDelete } = this.props;

    const content = (
      <div>
        <Button
          primary
          onClick={e => {
            e.preventDefault();
            this.avatarInputRef.current.click();
          }}
        >
          Изменить
        </Button>

        <input
          type="file"
          ref={this.avatarInputRef}
          hidden
          onChange={this.editAvatar}
          accept="image/x-png"
        />
        <Button onClick={() => onDelete()}>Удалить</Button>
      </div>
    );

    return (
      <Card>
        <Dimmer.Dimmable
          as={Image}
          dimmed={active}
          dimmer={{ active, content }}
          onMouseEnter={this.handleShow}
          onMouseLeave={this.handleHide}
          src={
            user.avatar ||
            "http://localhost:5000/placeholder/imagePlaceholder.png"
          }
        />
        <Card.Content>
          {oldAvatar !== user.avatar && (
            <div>
              <Button
                onClick={() => onSave()}
                color="green"
                disabled={isAvatarLoading}
                loading={isAvatarLoading}
              >
                Сохранить
              </Button>
              <Button
                onClick={() => onCancelChange()}
                color="black"
                disabled={isAvatarLoading}
                loading={isAvatarLoading}
              >
                Отмена
              </Button>
              <Divider />
            </div>
          )}
          <Card.Header>{user.login}</Card.Header>
          <Card.Meta>
            <span className="date">
              Дата регистрации:{" "}
              <b>
                {DateTime.fromISO(user.createdAt)
                  .setLocale("ru")
                  .toFormat("dd LLL yyyy")}
              </b>
            </span>
          </Card.Meta>
          <p>
            № читательского билета: <b>{user.readerId}</b>
          </p>
        </Card.Content>
      </Card>
    );
  }
}
