// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Loader, Dimmer, Card } from 'semantic-ui-react';

import { getPhotos } from '../actions/Photos';
import styles from './Home.css';

function renderLoading() {
  return (
    <Container className={styles.root}>
      <div className={styles.container} data-tid="container">
        <Dimmer active>
          <Loader />
        </Dimmer>
      </div>
    </Container>
  );
}

function renderError(error) {
  return (
    <Container className={styles.root}>
      <div className={styles.container} data-tid="container">
        {error}
      </div>
    </Container>
  );
}

class Home extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    Photos: PropTypes.shape({}).isRequired
  }

  componentDidMount() {
    this.props.dispatch(getPhotos());
  }

  renderPhotos(photos) {
    return photos.map(photo =>
      <Card
        key={photo.secret}
        image={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
        header={photo.title}
        meta={photo.isPublic > 0 ? 'public' : ''}
      />
    );
  }

  render() {
    const { Photos: { album, isFetching, error } } = this.props;

    if (isFetching) {
      return renderLoading();
    } else if (error) {
      return renderError(error);
    }
    return (
      <Container className={styles.root}>
        <div className={styles.container} data-tid="container">
          {
            album.photo ?
              <Card.Group>
                {this.renderPhotos(album.photo)}
              </Card.Group>
              :
              <span>no photos</span>
          }
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { Photos } = state;

  return {
    Photos
  };
}

export default connect(mapStateToProps)(Home);
