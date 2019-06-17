import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import { axs } from '@axios';

export default function withAuth(ComponentToProtect, passIfLogin) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      if (passIfLogin) {
        axs
          .get('/api/checkToken/', { headers: { 'x-access-token': Cookies.get('token') } })
          .then((res) => {
            if (res.status === 200) {
              this.setState({ loading: false });
            } else {
              const error = new Error(res.error);
              throw error;
            }
          })
          .catch((err) => {
            console.error(err);
            this.setState({ loading: false, redirect: true });
          });
      } else {
        this.props.history.push('/');
      }
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to='/login' />;
      }
      return (
        <>
          <ComponentToProtect {...this.props} />
        </>
      );
    }
  };
}
