import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { findAllByDisplayValue } from "@testing-library/react";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormVaild(this.state)) {
      this.setState({ loading: true, errors: [] });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log(user);
          this.setState({
            loading: false
          });
        })
        .catch(this.handleErrors);
    } else {
      let error = {};
      error.message = "Fill all the feilds";
      this.handleErrors(error);
    }
  };

  isFormVaild = ({ email, password }) => email && password;

  handleErrors = error =>
    this.setState({
      loading: false,
      errors: this.state.errors.concat(error)
    });

  displayErrors = errors =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  handleInputError = (errors, inputName) =>
    errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="yellow" textAlign="center">
            <Icon name="code branch" color="yellow" />
            Login to DevChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, "email")}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, "password")}
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="yellow"
                size="large"
              >
                Login
              </Button>
            </Segment>
          </Form>
          {errors.length ? (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          ) : null}
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
