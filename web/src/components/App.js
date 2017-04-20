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
      {this.props.message}
      </div>
    );
  }
}
