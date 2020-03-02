import React from "react";
import { Dropdown } from "semantic-ui-react";
import cn from "classnames";
import uniqid from "uniqid";

import s from "./index.module.scss";

export default function BookOptions(props) {
  const { isAdmin, pointing, additionPosition, options } = props;
  return (
    <>
      {isAdmin && (
        <Dropdown
          icon="ellipsis horizontal"
          floating
          button
          className={cn(s.headerDrop, "icon")}
          pointing={pointing}
          additionPosition={additionPosition}
        >
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              {options.map(option => (
                <Dropdown.Item
                  key={uniqid()}
                  text={option.text}
                  icon={option.icon}
                  onClick={() => option.onClick()}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}
