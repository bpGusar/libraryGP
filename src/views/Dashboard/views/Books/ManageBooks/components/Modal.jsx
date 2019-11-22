import React from "react";
import { Modal, Header, Button, Icon, Message, Label } from "semantic-ui-react";

export default function ModalWindow(props) {
  const { deleteBookModal, onBookDeleteClick } = props;

  return (
    <Modal open={deleteBookModal.open} size="small">
      <Header icon="remove" content="Удаление книги" />
      <Modal.Content>
        {!deleteBookModal.isLoading &&
          deleteBookModal.result.BookedBooks === 0 &&
          deleteBookModal.result.OrderedBooks === 0 && (
            <p>Вы действительно хотите удалить эту книгу?</p>
          )}
        {deleteBookModal.isLoading && (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Подождите</Message.Header>
              Удаляем книгу...
            </Message.Content>
          </Message>
        )}
        {!deleteBookModal.isLoading &&
          (deleteBookModal.result.BookedBooks !== 0 ||
            deleteBookModal.result.OrderedBooks !== 0) && (
            <>
              <Header as="h3" color="red">
                Произошла ошибка.
              </Header>
              <p>Книги есть у пользователей на руках либо они забронированы</p>
              <p>
                Забронированных книг:{" "}
                <Label>{deleteBookModal.result.BookedBooks}</Label>
              </p>
              <p>
                Книг на руках:{" "}
                <Label>{deleteBookModal.result.OrderedBooks}</Label>
              </p>
            </>
          )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          loading={deleteBookModal.isLoading}
          disabled={deleteBookModal.isLoading}
          basic
          color="grey"
          onClick={() => onBookDeleteClick(false)}
        >
          <Icon name="remove" /> Нет
        </Button>
        <Button
          disabled={
            deleteBookModal.isLoading ||
            deleteBookModal.result.BookedBooks !== 0 ||
            deleteBookModal.result.OrderedBooks !== 0
          }
          loading={deleteBookModal.isLoading}
          color="red"
          onClick={() => onBookDeleteClick(true)}
        >
          <Icon name="checkmark" /> Удалить
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
