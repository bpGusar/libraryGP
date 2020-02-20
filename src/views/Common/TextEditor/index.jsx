import React from "react";
import _ from "lodash";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import uniqid from "uniqid";

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.Id = uniqid("textEditor_");
    this.editor = {};
  }

  componentDidMount() {
    const { data } = this.props;
    this.editor = new EditorJS({
      holderId: this.Id,
      onChange: () => this.saver(),
      tools: {
        header: Header,
        list: List,
        quote: Quote,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `/api/blog/upload/imageByFile?token=${localStorage.getItem(
                "token"
              )}`,
              byUrl: `/api/blog/upload/imageByUrl?token=${localStorage.getItem(
                "token"
              )}`
            }
          }
        },
        delimiter: Delimiter,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/services/fetchMeta"
          }
        }
      },
      data: _.has(this.props, "data") ? { ...data } : {}
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
        // eslint-disable-next-line no-console
        console.log("Saving failed: ", error);
      });
  }

  render() {
    return <div id={this.Id} />;
  }
}
