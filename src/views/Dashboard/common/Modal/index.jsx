import React from "react";
import { Modal, Header, Button, Icon, Message } from "semantic-ui-react";

export default function ModalWindow(props) {
  const {
    header,
    open,
    firstPageContent,
    showFirstPageContentIf,
    isLoading,
    showSecondPageContentIf,
    secondPageContent,
    disableRunButton,
    onCancelClick,
    onRunClick
  } = props;

  return (
    <Modal open={open} size="small">
      <Header icon="exclamation circle" content={header} />
      <Modal.Content>
        {showFirstPageContentIf && <p>{firstPageContent}</p>}
        {isLoading && (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Подождите</Message.Header>
              Выполнение...
            </Message.Content>
          </Message>
        )}
        {showSecondPageContentIf && secondPageContent}
      </Modal.Content>
      <Modal.Actions>
        <Button
          loading={isLoading}
          disabled={isLoading}
          basic
          color="grey"
          onClick={() => onCancelClick()}
        >
          <Icon name="remove" /> Отмена
        </Button>
        <Button
          disabled={disableRunButton}
          loading={isLoading}
          color="green"
          onClick={() => onRunClick()}
        >
          <Icon name="checkmark" /> Выполнить
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
