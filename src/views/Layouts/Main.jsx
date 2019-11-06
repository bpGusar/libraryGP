import React from "react";

import { Segment, Responsive, Container } from "semantic-ui-react";

import Header from "@UI/Header";

export default function MainLayout(props) {
  const { children } = props;

  return (
    <>
      <Responsive>
        <Segment
          inverted
          textAlign="center"
          style={{ padding: "1em 0em" }}
          vertical
        >
          <Header />
        </Segment>
      </Responsive>
      <Container style={{ marginTop: "20px" }}>
        <div className="m-3">{children}</div>
      </Container>
    </>
  );
}
