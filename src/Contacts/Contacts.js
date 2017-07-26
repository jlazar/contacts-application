import React, { Component } from 'react';
import ContactsList from '../ContactsList/ContactsList.js';
import { ApiClient } from '../lib/contactually-api';
import './Contacts.css';

const apiClient = new ApiClient()

/**
* @name Contacts
* @desc Contacts Component that displays all of the contacts for the current logged in user
* @returns {void}
*/
class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };
  }

  componentDidMount() {
    //make async call when component mounts
    this.updateContacts();
  }

  /**
  * @name updateContacts
  * @desc Makes async call to contactually api to update the current state with all of the users contacts
  * @returns {void}
  */
  updateContacts() {
    apiClient.get('contacts', {
      onSuccess: ({ data }) => {
        this.setState({
          contacts: data
        })
      },
      onError: () => { /* would be cool to do something here */ }
    })
  }

  render() {
    return (
      <div className="Contacts">
        <ContactsList contacts={this.state.contacts} />
      </div>
    )
  }
}

export default Contacts
