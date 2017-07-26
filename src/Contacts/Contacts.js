import React, { Component } from 'react';
import './Contacts.css';
import ContactsList from '../ContactsList/ContactsList.js';
import { ApiClient } from '../lib/contactually-api';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
const apiClient = new ApiClient()

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };

    apiClient.get('contacts', {
      onSuccess: ({ data }) => {
        console.log(data);
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
