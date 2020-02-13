/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { convertToHTML } from "draft-convert";
import BlockStyleControls from "./components/BlockStyleControls";
import InlineStyleControls from "./components/InlineStyleControls";

import "./index.css";

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.editorRef = React.createRef();
    this.focus = () => this.editorRef.current.focus();
    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.onTab = e => this._onTab(e);
  }

  toggleBlockType = (type, e) => {
    e.preventDefault();
    this._toggleBlockType(type);
  };

  toggleInlineStyle = (style, e) => {
    e.preventDefault();
    this._toggleInlineStyle(style);
  };

  onChange = editorState => {
    const { onChange } = this.props;
    this.setState({
      editorState
    });

    onChange(convertToHTML(editorState.getCurrentContent()));
  };

  getBlockStyle = block => {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return null;
    }
  };

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const { editorState } = this.state;
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  render() {
    const { editorState } = this.state;

    let className = "RichEditor-editor";
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={this.getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Текст..."
            ref={this.editorRef}
            spellCheck
          />
        </div>
      </div>
    );
  }
}
