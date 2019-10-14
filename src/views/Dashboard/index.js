import React from "react";
import { Link } from "react-router-dom";
import { Button, Divider } from "semantic-ui-react";

import FindBookedBooks from "./components/FindBookedBooks";

export default function DashboardMain() {
  return (
    <>
      <Button as={Link} to="/dashboard/findBook" color="blue">
        Добавить книгу
      </Button>
      <Divider />
      <FindBookedBooks />
    </>
  );
}
