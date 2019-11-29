import React from "react";
import cn from "classnames";
import { Dropdown, Item, Modal } from "semantic-ui-react";

import EditElement from "../../EditElement";

import s from "../index.module.scss";

export default function ItemElement(props) {
  const { element, dbPropertyName, onDelete, linkPrefix, onEditSubmit } = props;
  return (
    <Item>
      <Item.Content>
        <Item.Header>{element[dbPropertyName]}</Item.Header>
        <Dropdown
          icon="ellipsis horizontal"
          floating
          button
          className={cn(s.headerDrop, "icon")}
        >
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              <Modal
                trigger={<Dropdown.Item icon="pencil" text="Редактировать" />}
              >
                <Modal.Header>Редактирование</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <EditElement
                      element={element}
                      dbPropertyName={dbPropertyName}
                      linkPrefix={linkPrefix}
                      onEditSubmit={onEditSubmit}
                    />
                  </Modal.Description>
                </Modal.Content>
              </Modal>
              <Dropdown.Item
                icon="trash"
                text="Удалить"
                onClick={() => onDelete(element)}
              />
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>
      </Item.Content>
    </Item>
  );
}
