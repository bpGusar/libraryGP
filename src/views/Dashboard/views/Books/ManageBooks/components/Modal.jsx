import React from "react";
import { Modal, Header, Button, Icon, Message } from "semantic-ui-react";

export default function ModalWindow(props) {
  const {
    header,
    open,
    firstPageText,
    showFirstPageContent,
    isLoading,
    secondPageContent,
    disableRunButton
  } = props;

  return (
    <Modal open={open} size="small">
      <Header icon="remove" content={header} />
      <Modal.Content>
        {showFirstPageContent && <p>{firstPageText}</p>}
        {isLoading && (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Подождите</Message.Header>
              Выполнение...
            </Message.Content>
          </Message>
        )}
        {secondPageContent}
      </Modal.Content>
      <Modal.Actions>
        <Button
          loading={isLoading}
          disabled={isLoading}
          basic
          color="grey"
          onClick={() => onBookDeleteClick(false)}
        >
          <Icon name="remove" /> Отмена
        </Button>
        <Button
          disabled={disableRunButton}
          loading={isLoading}
          color="green"
          onClick={() => onBookDeleteClick(true)}
        >
          <Icon name="checkmark" /> Выполнить
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
