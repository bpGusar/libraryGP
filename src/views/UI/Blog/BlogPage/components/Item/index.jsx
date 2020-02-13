import React from "react";
import { Header, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function BlogItem(props) {
  const { header, text, link } = props;
  return (
    <>
      <Header as="h2" attached="top">
        <Link to={link}>{header}</Link>
      </Header>
      <Segment attached>{text}</Segment>
      <Segment attached="bottom">ывапав</Segment>
    </>
  );
}
