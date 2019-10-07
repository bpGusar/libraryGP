import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button } from "semantic-ui-react";

const LoginAndRegister = props => {
  const { children } = props;
  return (
    <>
      <Button
        href="#"
        to="/"
        style={{
          margin: "10px 0px 0 10px"
        }}
        as={Link}
      >
        На главную
      </Button>
      <Grid
        textAlign="center"
        style={{ height: "95vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>{children}</Grid.Column>
      </Grid>
    </>
  );
};

export default LoginAndRegister;
