import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container } from 'semantic-ui-react';
import CreateContactModal from '../CreateContactModal/CreateContactModal.js';
import EditContactModal from '../EditContactModal/EditContactModal.js';
import DeleteContactModal from '../DeleteContactModal/DeleteContactModal';
import AddExistingModal from '../AddExistingModal/AddExistingModal';
import { ApiClient } from '../lib/contactually-api';
import './ContactsList.css';

const apiClient = new ApiClient();

/**
* @name ContactsList
* @desc ContactsList Component that creates the table of all of the contacts passed in through props
* @returns {void}
*/
class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreateModal: false,
      openEditModal: false
    };
    this.formData = {};
  }

  optionClicked(type, item) {
    if (type === 'edit') {
      this.formData = item;
      this.setState({
        openEditModal: true,
      })
    } else if (type === 'delete') {
      this.formData = item;
      this.setState({
        openDeleteModal: true,
      })
    }
  }

  closeModal(formData, updateType) {
    if (updateType === 'edit') {
      if (formData) {
        apiClient.patch(`contacts/${formData.id}`, {
          data: formData,
          onSuccess: ({ data }) => {
            this.setState({ openEditModal: false });
          },
          onError: () => { /* would be cool to do something here */ }
        })
      } else {
        this.setState({ openEditModal: false });
      }
    } else if (updateType === 'create') {
      if (formData) {
        if (this.props.bucketId) {
          if (!formData.extraData) {
            formData.extraData = {};
            formData.extraData.buckets = [];
          }
          formData.extraData.buckets.push({ id: this.props.bucketId });
        }
        apiClient.post('contacts', {
          data: formData,
          onSuccess: ({ data }) => {
            if (this.props.bucketId) {
              apiClient.post(`contacts/${data.id}/buckets`, {
                data: { id: this.props.bucketId },
                onSuccess: ({ data }) => {
                  this.setState({ openCreateModal: false });
                  this.props.updateContacts();
                },
                onError: () => {
                  /* would be cool to do something here */
                }
              });
            } else {
              this.setState({ openCreateModal: false });
              this.props.updateContacts();
            }
          },
          onError: () => { /* would be cool to do something here */ }
        })
      } else {
        this.setState({ openCreateModal: false });
      }
    } else if (updateType === 'delete') {
      if (formData) {
        apiClient.delete(`contacts/${formData.id}`, {
          data: {
            id: formData.id.split('contacts_')[1]
          },
          onSuccess: ({ data }) => {
            this.setState({ openDeleteModal: false });
            this.props.updateContacts();
          },
          onError: () => { /* would be cool to do something here */ }
        })
      } else {
        this.setState({ openDeleteModal: false });
      }
    } else if (updateType === 'addExisting') {
      if (formData) {
        let newData = [];
        for (let ele of formData) {
          if (ele.checked) {
            newData.push({ id: ele.id });
          }
        }
        apiClient.post(`buckets/${this.props.bucketId}/contacts`, {
          data: newData,
          onSuccess: ({ data }) => {
            this.setState({ openAddExistingModal: false });
            this.props.updateContacts();
          },
          onError: (error) => {
            console.log(error)
          }
        });
      } else {
        this.setState({ openAddExistingModal: false });
      }
      this.formData = {};
    }
  }

  getOptionsSection(item) {
    if (this.props.removeOptions) {
      return '';
    }
    return (
      <Table.Cell>
        <Button
          content='Edit'
          icon='edit'
          labelPosition='right'
          onClick={this.optionClicked.bind(this, 'edit', item)}
        />
        <Button
          content='Delete'
          icon='delete'
          labelPosition='right'
          onClick={this.optionClicked.bind(this, 'delete', item)}
        />
      </Table.Cell>);
  }

  render() {
    return (
      <div className="ContactsList">
        <CreateContactModal
          open={this.state.openCreateModal}
          close={(returnData) => this.closeModal(returnData, 'create')}
          formData={this.formData}
        />
        <EditContactModal
          open={this.state.openEditModal}
          close={(returnData) => this.closeModal(returnData, 'edit')}
          formData={this.formData}
        />
        <DeleteContactModal
          open={this.state.openDeleteModal}
          close={(returnData) => this.closeModal(returnData, 'delete')}
          formData={this.formData}
        />
        <AddExistingModal
          open={this.state.openAddExistingModal}
          close={(returnData) => this.closeModal(returnData, 'addExisting')}
          formData={this.props.contacts}
        />

        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Contact</Table.HeaderCell>
              <Table.HeaderCell>Buckets</Table.HeaderCell>
              {
                this.props.removeOptions ? '' : <Table.HeaderCell>Options</Table.HeaderCell>
              }

            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.contacts.map((item, index) =>
              <Table.Row key={index}>
                {/*Name section  */}
                <Table.Cell>
                  <div className='contactAvatar'>
                    <img src={item.avatarUrl} alt='Avatar' />
                  </div>
                  {item.firstName} {item.lastName}
                </Table.Cell>


                {/*Email section  */}
                <Table.Cell>
                  {item.emailAddresses.map((email, emailIndex) =>
                    <Container key={emailIndex}>
                      <b>{email.label}: </b>{email.address}
                    </Container>
                  )}
                  {item.phoneNumbers.map((number, numberIndex) =>
                    <Container key={numberIndex}>
                      <b>{number.label}: </b>{number.number}
                    </Container>
                  )}
                </Table.Cell>

                {/*Buckets section  */}
                <Table.Cell>
                  {item.extraData.buckets.map((bucket, bucketIndex) =>
                    <Container key={bucketIndex}>
                      <Link to={`/buckets/${bucket.id}`}>{bucket.name}</Link>
                    </Container>
                  )}
                </Table.Cell>
                {
                  this.getOptionsSection(item)
                }
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Button primary onClick={() => this.setState({ openCreateModal: true })}>New Contact</Button>
        {this.props.bucketId ?
          <Button primary onClick={() => this.setState({ openAddExistingModal: true })}>Add Existing Contact</Button> : ''
        }
      </div >
    )
  }
}

export default ContactsList
