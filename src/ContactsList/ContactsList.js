import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Image, Table } from 'semantic-ui-react';
import './ContactsList.css';

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
    this.formData = null;
  }

  optionClicked(type, item) {
    if (type === 'edit') {
      this.formData = {};
      this.setState({
        openEditModal: true,
      })
    } else if (type === 'delete') {
      this.formData = {};
      this.setState({
        openDeleteModal: true,
      })
    }
  }

  closeModal() {

  }

  render() {
    return (
      <div className="ContactsList">
        <CreateContactModal
          open={this.state.openCreateModal}
          close={this.closeModal}
          formData={this.formData}
        />
        <EditContactModal
          open={this.state.openEditModal}
          close={this.closeModal}
          formData={this.formData}
        />
        <DeleteContactModal
          open={this.state.openDeleteModal}
          close={this.closeModal}
          formData={this.formData}
        />
        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Buckets</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
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
                  {/*show all addresses  */}
                  {item.emailAddresses[0].address}
                </Table.Cell>

                {/*Buckets section  */}
                <Table.Cell>
                  <Dropdown
                    trigger={<Link to={`/bucket/${item.extraData.buckets[0].id}`}>{item.extraData.buckets[0].name}</Link>}
                    options={item.extraData.buckets}
                    pointing='top left'
                    icon={null}
                    multiple
                    selection
                  />
                </Table.Cell>

                {/*Options section  */}
                <Table.Cell>
                  <Button
                    content='Edit'
                    icon='heart'
                    labelPosition='right'
                    onClick={this.optionClicked('edit', item).bind(this)}
                  />
                  <Button
                    content='Delete'
                    icon='heart'
                    labelPosition='right'
                    onClick={this.optionClicked('delete', item).bind(this)}
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div >
    )
  }
}

export default ContactsList
