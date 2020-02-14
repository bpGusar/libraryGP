import React from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import SimpleImage from "@editorjs/simple-image";
import Quote from "@editorjs/quote";

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editor = new EditorJS({
      holderId: "textEditor",
      onChange: () => this.saver(),
      tools: {
        header: Header,
        list: List,
        quote: Quote,
        image: SimpleImage,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/services/fetchMeta"
          }
        }
      }
    });
  }

  saver() {
    this.editor
      .save()
      .then(outputData => {
        const { onChange } = this.props;
        onChange(outputData);
      })
      .catch(error => {
        console.log("Saving failed: ", error);
      });
  }

  render() {
    return <div id="textEditor" />;
  }
}
