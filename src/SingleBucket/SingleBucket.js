import React, { Component } from 'react';
import ContactsList from '../ContactsList/ContactsList.js';
import { ApiClient } from '../lib/contactually-api';
import { Container } from 'semantic-ui-react';

import './SingleBucket.css';

const apiClient = new ApiClient();

/**
* @name SingleBucket
* @desc Single Bucket Component that displays the properities and contacts for a bucket
* @returns {void}
*/
class SingleBucket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bucket: {},
      currentContacts: []
    };

    //data holder outside of state to wait for all async calls before setting state
    this.bucketData = {};
  }

  componentDidMount() {
    //make async calls when component mounts
    this.updateBucket(this.props.match.params.bucketId);
  }

  componentWillReceiveProps(props) {
    //only make async calls when the new bucket is different than the old one
    if (this.props.match.params.bucketId !== props.match.params.bucketId) {
      this.updateBucket(props.match.params.bucketId);
    }
  }

  /**
  * @name updateBucket
  * @desc Makes async calls to contactually api to update the current state with all of the users buckets
  * @returns {void}
  */
  updateBucket(bucketId) {
    //Get selected bucket
    apiClient.get(`buckets/${bucketId}`, {
      onSuccess: ({ data }) => {
        this.setBucketData({
          bucket: data
        });
      },
      onError: (error) => {
        console.log(error)
      }
    });

    //get contacts for selected bucket
    apiClient.get(`buckets/${bucketId}/contacts`, {
      onSuccess: ({ data }) => {
        this.setBucketData({
          currentContacts: data
        });
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }

  /**
  * @name setBucketData
  * @desc Setter after all async calls.. waits until it receives all 3 parts before updating state
  * @returns {void}
  */
  setBucketData(data) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        this.bucketData[key] = data[key];
      }
    }
    if (this.bucketData.bucket && this.bucketData.currentContacts) {
      this.setState(this.bucketData);
      //reset bucket data for next set of async calls
      this.bucketData = {};
    }
  }

  render() {
    console.log(this.state.bucket)
    return (
      // - Display a bucket which belongs to the user
      // - Display a list of contacts within that bucket
      // - Allow a user to add a contact to that bucket
      // - Allow a user to remove a contact from that bucket
      <div className="Bucket">
        <h3>{this.state.bucket.name}</h3>
        <Container>
          <ContactsList contacts={this.state.currentContacts} removeOptions={true} bucketId={this.props.match.params.bucketId} updateContacts={() => this.updateBucket(this.props.match.params.bucketId)} />
        </Container>
      </div>
    )
  }
}

export default SingleBucket
