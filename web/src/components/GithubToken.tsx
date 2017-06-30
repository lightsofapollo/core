import * as React from 'react';
import {
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';

import Field from './Field';

export default function GithubTokenForm() {
  return (
    <Form inline>
      <Field id="github-token" label="Github oAuth token: ">
        <FormControl
          type="text"
          placeholder="<GithubToken>"
          />
      </Field>
      <Button type="submit">
        Use Token
      </Button>
    </Form>
  );
}