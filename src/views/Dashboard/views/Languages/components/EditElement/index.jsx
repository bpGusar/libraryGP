import React, { useState } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import _ from "lodash";

import axs from "@axios";

export default function EditElement(props) {
  const { element } = props;

  const initialState = {
    updateData: element,
    errorMsg: "",
    isLoading: false
  };

  const [state, setState] = useState(initialState);

  const handleSubmitChanges = () => {
    const { linkPrefix, onEditSubmit } = props;
    const { updateData } = state;
    setState({ ...state, errorMsg: "", isLoading: true });
    axs.put(`${linkPrefix}${element._id}`, updateData).then(resp => {
      if (!resp.data.error) {
        onEditSubmit();
        setState({ ...state, isLoading: false });
      } else {
        setState({ ...state, errorMsg: resp.data.message, isLoading: false });
      }
    });
  };

  const { updateData, errorMsg, isLoading } = state;
  return (
    <Form onSubmit={handleSubmitChanges} loading={isLoading}>
      {!_.isEmpty(errorMsg) && (
        <Message negative>
          <Message.Header>Ошибка</Message.Header>
          <p>{errorMsg}</p>
        </Message>
      )}
      <Form.Input
        type="text"
        id="languageName"
        value={updateData.languageName}
        name="languageName"
        onChange={(e, { value, name }) =>
          setState({
            updateData: {
              ...updateData,
              [name]: value
            }
          })
        }
        required
        fluid
        icon="pencil"
        iconPosition="left"
        label="Название"
      />
      <Form.Input
        type="text"
        label="Код языка"
        id="langCode"
        value={updateData.langCode}
        name="langCode"
        onChange={(e, { value, name }) =>
          setState({
            updateData: {
              ...updateData,
              [name]: value
            }
          })
        }
        required
        fluid
        icon="pencil"
        iconPosition="left"
      />
      <Button type="submit" color="green">
        Сохранить
      </Button>
    </Form>
  );
}
