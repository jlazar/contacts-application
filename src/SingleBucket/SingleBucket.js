import React, { Component } from 'react';
import _ from 'lodash'
import { Button } from 'semantic-ui-react';
import ContactsList from '../ContactsList/ContactsList.js';
import { ApiClient } from '../lib/contactually-api';
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
      currentContacts: [],
      allContacts: []
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

    //get contacts for selected bucket
    apiClient.get(`contacts/`, {
      onSuccess: ({ data }) => {
        this.setBucketData({
          allContacts: data
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
      if(data.hasOwnProperty(key)) {
        this.bucketData[key] = data[key];
      }
    }
    if (this.bucketData.bucket && this.bucketData.currentContacts && this.bucketData.allContacts) {
      console.log(this.bucketData)
      this.setState(this.bucketData);
      //reset bucket data for next set of async calls
      this.bucketData = {};
    }
  }

  /**
  * @name onSelectionsChange
  * @desc Adds and removes contacts from the current bucket
  * @returns {void}
  */
  onSelectionsChange() {
    let addRemoveContacts = _.differenceBy(this.selectedContacts, this.state.currentContacts, 'id'),
      addContacts = [],
      removeContacts = [];
    for(let contact of addRemoveContacts) {
      let index = _.findIndex(this.selectedContacts, function(item) { return item.id == contact.id })
      if(index > -1) {
        //add the contact
        addContacts.push({'id': contact.id});
      } else {
        //remove the contact
        removeContacts.push({'id': contact.id});
      }
    }

    if(addContacts.length > 0) {
      apiClient.post(`buckets/${this.props.match.params.bucketId}/contacts`, {
        // data: {
        //   data: addContacts
        // },
        data: addContacts,
        onSuccess: ({ data }) => {
          //returns all contacts
          this.setState({
            bucket: data
          });
        },
        onError: (error) => {
          console.log(error)
        }
      });
    }

    if(removeContacts.length > 0) {
      apiClient.delete(`buckets/${this.props.match.params.bucketId}/contacts`, {
        // data: {
        //   data: removeContacts
        // },
        data: removeContacts,
        onSuccess: ({ data }) => {
          //returns all contacts
          this.setState({
            bucket: data
          });
        },
        onError: (error) => {
          console.log(error)
        }
      });
    }
    
  }

  render() {
    return (
      // - Display a bucket which belongs to the user
      // - Display a list of contacts within that bucket
      // - Allow a user to add a contact to that bucket
      // - Allow a user to remove a contact from that bucket
      <div className="Bucket">
        {this.state.bucket.name}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* <SuperSelectField
            name='state11'
            hintText='Single value'
            onChange={this.onSelectionsChange}
            value={this.selectedContacts}
            style={{ minWidth: 150, margin: 10 }}
          >
            {this.state.allContacts.map((item, index) => 
              <div key={item}>
                <div className='contactAvatar'>
                  <img src={item.avatarUrl} alt='Avatar' />
                </div>
                {item.firstName} {item.lastName}
              </div>
            )}
          </SuperSelectField> */}
        </div>
        <ContactsList contacts={this.state.currentContacts} removeOptions={true} bucketId={this.props.match.params.bucketId} updateContacts={() => this.updateBucket(this.props.match.params.bucketId)}/>
      </div>
    )
  }
}

export default SingleBucket
