import React, { Component } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'
import { Menu } from 'semantic-ui-react';
import Contacts from '../Contacts/Contacts.js'
import SingleBucket from '../SingleBucket/SingleBucket.js';
import Buckets from '../Buckets/Buckets.js';
import logo from './logo.svg'
import './App.css'

/**
* @name App
* @desc Appplication Starter Component that houses the rest of the application
* @returns {void}
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Home'
    };
  }

  /**
  * @name handleItemClick
  * @desc Menu click event handler
  * @param {object} e - click event
  * @param {string} name - name of the clicked item
  * @returns {void}
  */
  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
    this.props.history.push(this.getRouteForMenuItem(name));
  }

  /**
  * @name getRouteForMenuItem
  * @desc Returns route for a menu item
  * @param {string} name - clicked menu item
  * @returns {string} - route for the menu item
  */
  getRouteForMenuItem(name) {
    if (name === 'Home')
      return '/'
    if (name === 'Contacts')
      return '/contacts/';
    if (name === 'Buckets')
      return '/buckets/0';
  }

  render() {
    const { activeItem } = this.state;
    return (
      <div className="App">
        {/*App Header*/}
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Contactually Lite</h2>
        </div>
        {/*App Menu*/}
        <Menu pointing secondary fluid>
          <Menu.Item
            name='Home'
            active={activeItem === 'Home'}
            onClick={this.handleItemClick.bind(this)}
          />
          <Menu.Item
            name='Contacts'
            active={activeItem === 'Contacts'}
            onClick={this.handleItemClick.bind(this)}
          />
          <Menu.Item
            name='Buckets'
            active={activeItem === 'Buckets'}
            onClick={this.handleItemClick.bind(this)}
          />
        </Menu>

        {/*All App Routes*/}
        <Route exact path='/' render={() => (
          <p className="App-intro">
            Hey there, <br />
            Please use the navigation to move around this app<br /><br />
            For the power users, check out /contacts, /buckets, /contacts/:contactId, and /buckets/:bucketId
            </p>
        )} />
        <Route path='/contacts/' component={Contacts} />
        <Route path='/buckets/:bucketId' component={SingleBucket} />
        <Route path='/buckets/' component={Buckets} />
      </div>
    )
  }
}

export default withRouter(App);
