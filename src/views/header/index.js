import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';

class Header extends React.Component {
  render() {
    return (
      <Navbar bg='dark' variant='dark'>
        <Nav className='mr-auto'>
          <LinkContainer to='/secret'>
            <Button>Секрет</Button>
          </LinkContainer>
        </Nav>
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>
            Signed in as: <a href=''>{this.props.userInfo}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default branch(
  {
    userInfo: PARAMS.USER_INFO,
  },
  Header,
);
