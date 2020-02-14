import React from "react";
import { Header, Segment, Image, List } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function BlogItem(props) {
  const { header, text, link } = props;
  const html = [];
  text.blocks.forEach(block => {
    switch (block.type) {
      case "header":
        html.push(
          <Header as={`h${block.data.level}`}>{block.data.text}</Header>
        );
        break;
      case "paragraph":
        html.push(<p>{block.data.text}</p>);
        break;
      case "delimiter":
        html.push(<hr />);
        break;
      case "image":
        html.push(
          `${(<Image src={block.data.file.url} />)}<br /><em>${
            block.data.caption
          }</em>`
        );
        break;
      case "list":
        html.push(
          <List
            bulleted={block.data.style === "unordered"}
            ordered={block.data.style === "ordered"}
          >
            {block.data.items.map(li => (
              <List.Item>{li}</List.Item>
            ))}
          </List>
        );
        break;
      default:
        console.log("Unknown block type", block.type);
        console.log(block);
        break;
    }
  });
  return (
    <>
      <Header as="h2" attached="top">
        <Link to={link}>{header}</Link>
      </Header>
      <Segment attached>{html}</Segment>
      <Segment attached="bottom">ывапав</Segment>
    </>
  );
}
