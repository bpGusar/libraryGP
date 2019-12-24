import React from "react";
import { Form } from "semantic-ui-react";

export default function ResultFilters(props) {
  const { sort, limit, onChangeLimit, onChangeSort } = props;
  return (
    <Form.Group widths="equal">
      <Form.Dropdown
        label="Сортировка"
        selection
        defaultValue={sort}
        onChange={(e, { value }) => onChangeSort(value)}
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
      <Form.Input
        label="Элементов на странице"
        type="number"
        max={99}
        min={1}
        defaultValue={limit}
        onChange={(e, { value }) => onChangeLimit(value)}
      />
    </Form.Group>
  );
}
