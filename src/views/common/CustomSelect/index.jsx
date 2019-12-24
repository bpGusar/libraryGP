import React from "react";
import { Select, Form } from "semantic-ui-react";
import uniqid from "uniqid";

function CustomSelect(props) {
  const {
    label,
    options,
    name: selectName,
    id,
    defaultValue,
    onChange,
    placeholder,
    required
  } = props;

  const unqId = uniqid("cussel_");

  return (
    <Form.Field required={required}>
      <label htmlFor={id || unqId}>{label}</label>
      <Select
        name={selectName}
        required={required}
        id={id || unqId}
        placeholder={placeholder}
        options={options}
        defaultValue={defaultValue}
        onChange={(e, { value, name }) => onChange(value, name)}
      />
    </Form.Field>
  );
}

export default CustomSelect;
