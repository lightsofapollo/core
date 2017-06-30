import * as React from 'react';
import {
  Button,
  Form,
  FormControl
} from 'react-bootstrap';
import { connect } from 'react-redux';

import {
  default as Field,
  InputEvent,
} from './Field';
import {createUser} from '../actions';

type SignUpState = {
  error: string | null;
};

type SignUpProps = {
  onComplete: (password: string) => any;
};

export default class SignUpForm extends React.Component<SignUpProps, SignUpState> {
  state: SignUpState = {
    error: null,
  };

  /**
   * We maintain form state outside of react state. This is purely for record keeping
   * and returning the values to the onComplete event.
   */
  private form: {
    password?: string;
    passwordAgain?: string;
  } = {};

  /**
   * We only dispatch the "onComplete" event when the data is fully validated.
   */
  private formValidate() {
    const {password, passwordAgain} = this.form;
    if (password && password === passwordAgain) {
      return true;
    }
    this.setState({
      error: 'Password empty or mismatch',
    });
    return false;
  }

  private getValue(e: React.FormEvent<any>) {
    const el = e.target as HTMLInputElement;
    return el.value;
  }

  private setPassword = (event: InputEvent) => {
    this.form.password = this.getValue(event);
    this.formValidate();
  };

  private setPasswordAgain = (event: InputEvent) => {
    this.form.passwordAgain = this.getValue(event);
    this.formValidate();
  };

  private onSubmit = (event: React.FormEvent<Form>) => {
    if (this.formValidate() && this.form.password) {
      this.props.onComplete(this.form.password);
    }
  }

  render() {
    return (
      <Form horizontal onSubmit={this.onSubmit}>
        <Field onChange={this.setPassword} id="password" label="Password">
          <FormControl type="password" />
        </Field>
        <Field onChange={this.setPasswordAgain} id="password-again" label="Enter Password Again">
          <FormControl type="password" />
        </Field>
        <Button type="submit">
          Use passwords
        </Button>
      </Form>
    );
  }
}