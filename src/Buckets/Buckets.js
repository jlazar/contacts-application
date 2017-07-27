import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Container } from 'semantic-ui-react';
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

  getReminderInterval(reminderInterval) {
    if (reminderInterval) {
      if (reminderInterval === 1)
        return '' + reminderInterval + ' day'
      else
        return '' + reminderInterval + ' days'
    } else
      return 'None'
  }


  render() {
    return (
      // - Display all buckets for the user
      <div className="Buckets">
        <Container>
          <Table celled fixed singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Contacts</Table.HeaderCell>
                <Table.HeaderCell>Goal</Table.HeaderCell>
                <Table.HeaderCell>Reminder</Table.HeaderCell>
                <Table.HeaderCell>Grade</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.buckets.map((item, index) =>
                <Table.Row key={index}>
                  {/*Name Section  */}
                  <Table.Cell className='buckets-primary-cell'>
                    <Link to={`/buckets/${item.id}`}>{item.name}</Link>
                  </Table.Cell>

                  {/*Contacts Section  */}
                  <Table.Cell className='buckets-secondary-cell'>
                    {item.extraData.contactCount}
                  </Table.Cell>

                  {/*Goal Section  */}
                  <Table.Cell className='buckets-secondary-cell'>
                    {item.goal ? item.goal : 'None'}
                  </Table.Cell>

                  {/*Reminder Interval  */}
                  <Table.Cell className='buckets-secondary-cell'>
                    {this.getReminderInterval(item.reminderInterval)}
                  </Table.Cell>

                  {/*Relationship Grade */}
                  <Table.Cell className='buckets-secondary-cell'>
                    {item.extraData.relationshipStatus.grade}
                  </Table.Cell>

                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Container>
      </div>
    )
  }
}

export default Buckets
