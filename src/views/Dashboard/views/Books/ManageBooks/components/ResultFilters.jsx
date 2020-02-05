import React from "react";
import { Form } from "semantic-ui-react";

export default function ResultFilters(props) {
  const { options, onChangeLimit, onChangeResultFilterValue } = props;
  return (
    <Form.Group widths="equal">
      <Form.Dropdown
        label="Сортировка"
        selection
        defaultValue={options.sort}
        onChange={(e, { value }) => onChangeResultFilterValue(value, "sort")}
        options={[
          {
            key: "asc",
            text: "По возрастанию",
            value: "asc"
          },
          {
            key: "desc",
            text: "По убыванию",
            value: "desc"
          }
        ]}
      />
      <Form.Dropdown
        label="Что показывать"
        selection
        defaultValue={options.displayMode}
        onChange={(e, { value }) =>
          onChangeResultFilterValue(value, "displayMode")
        }
        options={[
          {
            key: 0,
            text: "Всех",
            value: "all"
          },
          {
            key: 1,
            text: "Только скрытые",
            value: "true"
          },
          {
            key: 2,
            text: "Только не скрытые",
            value: "false"
          }
        ]}
      />
      <Form.Input
        label="Элементов на странице"
        type="number"
        max={99}
        min={1}
        defaultValue={options.limit}
        onChange={(e, { value }) => onChangeLimit(value)}
      />
    </Form.Group>
  );
}
