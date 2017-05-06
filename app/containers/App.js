// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Sidebar, Segment, Menu, Icon } from 'semantic-ui-react';

// Actions
import styles from './App.css';

class App extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation="push" width="thin" visible icon="labeled" vertical inverted>
            <Menu.Item name="home">
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item name="gamepad">
              <Icon name="gamepad" />
              Games
            </Menu.Item>
            <Menu.Item name="camera">
              <Icon name="camera" />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <div className={styles.container}>
              {children}
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { User } = state;

  return {
    User
  };
}

export default connect(mapStateToProps)(App);
