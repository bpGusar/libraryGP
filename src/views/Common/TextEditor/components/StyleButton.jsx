/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { Button, Icon } from "semantic-ui-react";

export default class StyleButton extends React.Component {
  onToggle = e => {
    e.preventDefault();
    const { onToggle, style } = this.props;
    onToggle(style, e);
  };

  render() {
    const { active, icon, label } = this.props;
    let className = "RichEditor-styleButton";
    if (active) {
      className += " RichEditor-activeButton";
    }

    return (
      <Button
        className={className}
        onMouseDown={this.onToggle}
        icon={icon && true}
        size="tiny"
      >
        {icon && <Icon name={icon} />}
        {label && label}
      </Button>
    );
  }
}
