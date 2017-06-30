import * as React from 'react';
import {
  FormGroup,
  Col,
  ControlLabel,
  FormGroupProps,
} from 'react-bootstrap';

export type InputEvent = React.FormEvent<FormGroup>;

export default function Field({id, label, children, ...props}: {
  id: string,
  label: string,
  children: JSX.Element,
} & FormGroupProps) {
  return (
    <FormGroup {...props} controlId={id}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}>{children}</Col>
    </FormGroup>
  );
}