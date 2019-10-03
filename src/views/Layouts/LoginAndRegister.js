import React from "react";
import { Grid } from "semantic-ui-react";

const LoginAndRegister = props => {
  const { children } = props;
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>{children}</Grid.Column>
    </Grid>
  );
};

export default LoginAndRegister;
