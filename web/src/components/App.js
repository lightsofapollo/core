/**
 * @flow
 */
import React from 'react';

export default class App extends React.Component {
  props: {
    message: string
  }

  thisWillFooBar() {
    return 1 + 1 + 3;
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
