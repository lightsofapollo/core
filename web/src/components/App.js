/**
 * @flow
 */
import React from 'react';

export default class App extends React.Component {
  props: {
    message: string
  }

  render() {
    return (
      <div>
        <p>Foobar</p>
        {this.props.message}
      </div>
    );
  }
}
