import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
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
      activeItem: this.props.history.location.pathname.split('/')[1]
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
    if (name === '')
      return '/'
    if (name === 'contacts')
      return '/contacts/';
    if (name === 'buckets')
      return '/buckets/';
  }

  render() {
    const { activeItem } = this.state;
    return (
      <div className="App">
        {/*App Header*/}
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="App-title">Contactually Lite</h2>
        </div>
        {/*App Menu*/}
        <Menu pointing secondary fluid>
          <Menu.Item
            name=''
            active={activeItem === ''}
            onClick={this.handleItemClick.bind(this)}
          >Home</Menu.Item>
          <Menu.Item
            name='contacts'
            active={activeItem === 'contacts'}
            onClick={this.handleItemClick.bind(this)}
          />
          <Menu.Item
            name='buckets'
            active={activeItem === 'buckets'}
            onClick={this.handleItemClick.bind(this)}
          />
        </Menu>

        {/*All App Routes*/}
        <Route exact path='/' render={() => (
          <p className="App-intro">
            Hey there, <br />
            Please use the navigation to move around this app<br /><br />
            Check out /contacts, /buckets, and /buckets/:bucketId
            </p>
        )} />
        <Route path='/contacts/' component={Contacts} />
        <Route path='/buckets/:bucketId' component={SingleBucket} />
        <Route exact path='/buckets/' component={Buckets} />
      </div>
    )
  }
}

export default withRouter(App);
