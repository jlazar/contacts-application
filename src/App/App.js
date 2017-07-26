import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import Contacts from '../Contacts/Contacts.js'
import Bucket from '../Bucket/Bucket.js'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Contactually Lite</h2>
          </div>
          <div className='ApplicationHeader'>
            <Link to={'/'}>Home</Link>
            <Link to={'/contacts/'}>Contacts</Link>
            <Link to={'/bucket/0'}>Bucket</Link>
          </div>
          <Route exact path='/' render={() => (
            <p className="App-intro">
              Hey there, <br />
              We're excited to see what you build!
            </p>
          )} />
          <Route path='/contacts/' component={Contacts}/>
          <Route path='/bucket/:bucketId' component={Bucket}/>
        </div>
      </Router>
    )
  }
}

export default App
