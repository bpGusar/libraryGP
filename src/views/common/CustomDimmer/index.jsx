import React from "react";
import { Header, Dimmer, Loader, Icon } from "semantic-ui-react";

export default function CustomDimmer(props) {
  const {
    active,
    showLoader,
    success,
    loaderText,
    successIcon,
    successText
  } = props;
  return (
    <Dimmer active={active}>
      {showLoader && <Loader>{loaderText}</Loader>}
      {success && (
        <>
          <Header as="h5" icon inverted>
            <Icon name={successIcon} />
            {successText}
          </Header>
        </>
      )}
    </Dimmer>
  );
}
