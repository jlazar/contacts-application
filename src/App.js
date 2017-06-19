import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Contactually Lite</h2>
        </div>
        <p className="App-intro">
          Hey there, <br />
          We're excited to see what you build!
        </p>
      </div>
    )
  }
}

export default App
