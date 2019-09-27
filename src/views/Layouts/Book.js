import React from "react";

import { Segment, Responsive, Container, Image } from "semantic-ui-react";

import Header from "@views/Header";
import headerStyles from "@views/Header/Header.module.scss";

export default function MainLayout(props) {
  const { children } = props;
  return (
    <>
      <Responsive>
        <Segment
          inverted
          textAlign="center"
          style={{ padding: "1em 0em", zIndex: 1 }}
          vertical
        >
          <Header segmentClassName={headerStyles.segmentClass} />
        </Segment>
        <Image
          fluid
          style={{
            position: "absolute",
            top: 0
          }}
          src="http://localhost:5000/posters/fde8c4f4799fc918670df4bf906484e6.png"
        />
      </Responsive>
      <Container style={{ marginTop: "20px" }}>
        <div className="m-3">{children}</div>
      </Container>
    </>
  );
}
