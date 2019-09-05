import React from "react";
import { branch } from "baobab-react/higher-order";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { PARAMS } from "@store";

function InfoPage(props) {
  const { infoPage } = props;
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="checkmark" color="green" />
        {infoPage}
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/">
          На главную
        </Button>
      </Segment.Inline>
    </Segment>
  );
}

export default branch(
  {
    infoPage: PARAMS.INFO_PAGE
  },
  InfoPage
);
