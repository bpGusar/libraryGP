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
    required,
    loading,
    value: selectValue
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
        value={selectValue}
        loading={loading || undefined}
      />
    </Form.Field>
  );
}

export default CustomSelect;
