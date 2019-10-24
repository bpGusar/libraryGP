import React from "react";
import { Form } from "semantic-ui-react";

export default function ResultFilters(props) {
  const { options, _this } = props;
  return (
    <Form.Group widths="equal">
      <Form.Dropdown
        label="Сортировка"
        selection
        defaultValue={options.sort}
        onChange={(e, { value }) =>
          _this.setState({
            options: {
              ...options,
              sort: value
            }
          })
        }
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
        defaultValue={options.limit}
        onChange={(e, { value }) =>
          _this.setState({
            options: {
              ...options,
              limit: Number(value)
            }
          })
        }
      />
    </Form.Group>
  );
}
