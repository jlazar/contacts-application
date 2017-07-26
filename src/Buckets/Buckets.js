import React, { Component } from 'react';
import ContactsList from '../ContactsList/ContactsList.js';
import { ApiClient } from '../lib/contactually-api';
import './Buckets.css';

const apiClient = new ApiClient();

/**
* @name Buckets
* @desc Buckets Component that displays all of the buckets for the current logged in user
* @returns {void}
*/
class Buckets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buckets: []
    };
  }

  componentDidMount() {
    //make async call when component mounts
    this.updateBuckets();
  }

  /**
  * @name updateBuckets
  * @desc Makes async call to contactually api to update the current state with all of the users buckets
  * @returns {void}
  */
  updateBuckets() {
    //Get all buckets
    apiClient.get(`buckets/`, {
      onSuccess: ({ data }) => {
        this.setState({
          buckets: data
        });
      },
      onError: (error) => {
        console.log(error)
      }
    });
  }

  render() {
    return (
      // - Display all buckets for the user
      <div className="Buckets">

      </div>
    )
  }
}

export default Buckets
