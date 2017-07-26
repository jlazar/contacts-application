import React, { Component } from 'react';
import './ContactsList.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

class Contacts extends Component {
  render() {
    return (
      <div className="ContactsList">
        <ul>
          <li className='list-flex'>
            <div>
              Name
            </div>
            <div>
              Email
            </div>
            <div>
              Buckets
            </div>
          </li>
          {this.props.contacts.map((item, index) =>
            <li key={index} className='list-flex'>
              <div>
                <div className='contactAvatar'>
                  <img src={item.avatarUrl} />
                </div>
                {item.firstName} {item.lastName}
              </div>
              <div>
                {/*show all addresses  */}
                {item.emailAddresses[0].address}
              </div>
              <div>
              {item.extraData.buckets.map((bucket, bIndex) =>
                <div key={bIndex}>
                   <Link to={`/bucket/${bucket.id}`}>{bucket.name}</Link> 
                </div>
              )}
              </div>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Contacts
