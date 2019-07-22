import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

export default function MainPage() {
  return (
    <div>
      главная <br />
      <Button as={Link} to="/findBook" color="blue">
        Добавить книгу
      </Button>
    </div>
  );
}
