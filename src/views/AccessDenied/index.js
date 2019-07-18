import React from "react";
import { branch } from "baobab-react/higher-order";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { PARAMS } from "@store";

function AccessDenied(props) {
  const { isUserAuthorized } = props;
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="close" color="red" />
        Доступ на страницу ограничен.{" "}
        {!isUserAuthorized ? "Выполните вход и повторите попытку." : ""}
      </Header>
      <Segment.Inline>
        {!isUserAuthorized ? (
          <Button primary as={Link} to="/login">
            Войти
          </Button>
        ) : (
          ""
        )}
        <Button as={Link} to="/">
          На главную
        </Button>
      </Segment.Inline>
    </Segment>
  );
}

export default branch(
  { isUserAuthorized: PARAMS.IS_USER_AUTHORIZED },
  AccessDenied
);
