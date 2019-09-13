import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { PARAMS } from "@store";

function InfoPage(props) {
  const types = {
    error: {
      icon: "close",
      color: "red"
    },
    success: {
      icon: "checkmark",
      color: "green"
    }
  };
  const { infoPage, history } = props;
  return (
    <Segment placeholder>
      {_.isEmpty(infoPage.type) ? (
        history.push("/")
      ) : (
        <>
          <Header icon>
            <Icon
              name={types[infoPage.type].icon}
              color={types[infoPage.type].color}
            />
            {infoPage.text}
          </Header>
          <Segment.Inline>
            <Button as={Link} to="/">
              На главную
            </Button>
          </Segment.Inline>
        </>
      )}
    </Segment>
  );
}

export default branch(
  {
    infoPage: PARAMS.INFO_PAGE
  },
  InfoPage
);
