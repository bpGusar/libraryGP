/* eslint-disable react/no-array-index-key */
import React from "react";
import { Header, Image, List, Divider } from "semantic-ui-react";
import ReactHtmlParser from "react-html-parser";

export default function Text(props) {
  const { jsonData, textType } = props;
  const html = [];
  let previewBreak = false;
  jsonData.blocks.forEach((block, idx) => {
    if (!previewBreak) {
      switch (block.type) {
        case "header":
          html.push(
            <Header key={`${block.type}_${idx}`} as={`h${block.data.level}`}>
              {block.data.text}
            </Header>
          );
          break;
        case "paragraph":
          html.push(
            <p key={`${block.type}_${idx}`}>
              {ReactHtmlParser(block.data.text)}
            </p>
          );
          break;
        case "delimiter":
          if (textType === "preview") {
            previewBreak = true;
            break;
          }
          html.push(<Divider key={`${block.type}_${idx}`} />);
          break;
        case "image":
          html.push(
            <p key={`${block.type}_${idx}`}>
              <Image src={block.data.file.url} centered />
              <br />
              <em>{block.data.caption}</em>
            </p>
          );
          break;
        case "list":
          html.push(
            <List
              key={`${block.type}_${idx}`}
              bulleted={block.data.style === "unordered"}
              ordered={block.data.style === "ordered"}
            >
              {block.data.items.map((li, liIdx) => (
                <List.Item key={liIdx}>{ReactHtmlParser(li)}</List.Item>
              ))}
            </List>
          );
          break;
        default:
          // eslint-disable-next-line no-console
          console.log("Unknown block type", block.type);
          // eslint-disable-next-line no-console
          console.log(block);
          break;
      }
    }
  });
  return <>{html}</>;
}
