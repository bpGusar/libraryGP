import React from "react";
import StyleButton from "./StyleButton";

const INLINE_STYLES = [
  { style: "BOLD", icon: "bold" },
  { style: "ITALIC", icon: "italic" },
  { style: "UNDERLINE", icon: "underline" },
  { style: "CODE", icon: "code" }
];

export default function InlineStyleControls(props) {
  // eslint-disable-next-line react/destructuring-assignment
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.style}
          icon={type.icon}
          active={currentStyle.has(type.style)}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
}
