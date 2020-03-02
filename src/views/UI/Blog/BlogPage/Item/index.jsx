import React from "react";
import { Header, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

import Text from "../../components/Text";

export default function BlogItem(props) {
  const { header, jsonData, link } = props;

  return (
    <>
      <Header as="h2" attached="top">
        <Link to={link}>{header}</Link>
      </Header>
      <Segment attached>
        <Text jsonData={jsonData} textType="preview" />
      </Segment>
    </>
  );
}
