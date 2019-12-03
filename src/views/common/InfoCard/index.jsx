import React from "react";
import { Button, Card, Statistic } from "semantic-ui-react";
import { withRouter, Link } from "react-router-dom";

import CustomDimmer from "@commonViews/CustomDimmer";

function InfoCard(props) {
  const {
    loaderText,
    successIcon,
    successText,
    active,
    showLoader,
    success,
    statLabel,
    statValue,
    reactRedirectTo,
    buttonText,
    cardHeader
  } = props;
  return (
    <Card>
      <CustomDimmer
        loaderText={loaderText || ""}
        successIcon={successIcon}
        successText={successText || ""}
        active={active}
        showLoader={showLoader}
        success={success}
      />
      <Card.Content>
        <Card.Header
          style={{
            textAlign: "center"
          }}
        >
          {cardHeader}
        </Card.Header>
        <Card.Description
          style={{
            textAlign: "center"
          }}
        >
          <Statistic size="small">
            <Statistic.Label>{statLabel}</Statistic.Label>
            <Statistic.Value>{statValue}</Statistic.Value>
          </Statistic>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as={Link} to={reactRedirectTo} fluid color="green">
          {buttonText}
        </Button>
      </Card.Content>
    </Card>
  );
}

export default withRouter(InfoCard);
