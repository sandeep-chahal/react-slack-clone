import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordconfirmation: "",
    errors: [],
    loading: false
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  isFormEmpty = ({ username, email, password, passwordconfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordconfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordconfirmation }) => {
    if (password.length < 6 && passwordconfirmation.length < 6) return false;
    else if (password !== passwordconfirmation) return false;
    else return true;
  };

  isFormVaild = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      this.setState({ errors: [], loading: true });
      return true;
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormVaild()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log(user);
          user.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `https://avatars.dicebear.com/v2/male/${md5(
                user.user.email
              )}.svg?options[mood][]=happy&options[mood][]=surprised`
            })
            .then(() => {
              firebase
                .database()
                .ref("users")
                .child(user.user.uid)
                .set({
                  name: user.user.displayName,
                  avatar: user.user.photoURL
                })
                .then(() => {
                  this.setState({ loading: false });
                })
                .catch(this.handleErrors);
            })
            .catch(this.handleErrors);
        })
        .catch(this.handleErrors);
    }
  };

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
    const {
      username,
      email,
      password,
      passwordconfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="yellow" textAlign="center">
            <Icon name="microchip" color="yellow" />
            Register for DevChat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
              />
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
              <Form.Input
                fluid
                name="passwordconfirmation"
                icon="lock"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
                value={passwordconfirmation}
                className={this.handleInputError(errors, "password")}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="yellow"
                size="large"
              >
                Submit
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
            Already a member? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
