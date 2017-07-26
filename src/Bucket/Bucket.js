import React, { Component } from 'react';
import './Bucket.css';
import ContactsList from '../ContactsList/ContactsList.js';
import SuperSelectField from 'material-ui-superselectfield';
import { ApiClient } from '../lib/contactually-api';
const apiClient = new ApiClient();

class Bucket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bucket: {},
      contacts: []
    };

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
          contacts: data
        });
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }

  setBucketData(data) {
    for (let key in data) {
      this.bucketData[key] = data[key];
    }
    if (this.bucketData.bucket && this.bucketData.contacts) {
      this.setState(this.bucketData);
      this.bucketData = {};
    }
  }
  onSelectionsChange() {
    console.log(this.state);
  }

  render() {
    return (
      // - Display a bucket which belongs to the user
      // - Display a list of contacts within that bucket
      // - Allow a user to add a contact to that bucket
      // - Allow a user to remove a contact from that bucket
      <div className="Bucket">
        {this.state.bucket.name}
        <button>Add Contact</button>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <SuperSelectField
            name='state11'
            hintText='Single value'
            onChange={this.onSelectionsChange}
            value={this.selectedContacts}
            style={{ minWidth: 150, margin: 10 }}
          >
            <div value='A'>Option A</div>
            <div value='B'>Option B</div>
            <div value='C'>Option C</div>
          </SuperSelectField>
        </div>
        <ContactsList contacts={this.state.contacts} />
      </div>
    )
  }
}

export default Bucket
