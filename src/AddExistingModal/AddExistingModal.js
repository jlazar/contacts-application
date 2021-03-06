import React, { Component } from 'react'
import { Button, Modal, Checkbox } from 'semantic-ui-react'
import { ApiClient } from '../lib/contactually-api';
const apiClient = new ApiClient();

/**
* @name AddExistingModal
* @desc Add Existing Modal for adding a contact to a bucket
* @returns {void}
*/
class AddExistingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.formData,
      contacts: []
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      formData: props.formData
    });
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
        for (let ele of this.state.formData) {
          for (let currentEle of data) {
            if (ele.id === currentEle.id) {
              currentEle.checked = true;
            }
          }
        }
        this.setState({
          contacts: data
        })
      },
      onError: () => { /* would be cool to do something here */ }
    })
  }

  /**
  * @name handleChange
  * @desc Updates the modal state
  * @param {number} index - contact index to mark as checked
  * @returns {void}
  */
  handleChange(index) {
    const contacts = this.state.contacts;
    contacts[index].checked = !contacts[index].checked;
    this.setState({
      contacts: contacts
    });
  }

  render() {
    return (
      <div>
        <Modal dimmer={true} open={this.props.open} onClose={this.props.close} closeOnDocumentClick={true}>
          <Modal.Header>Add existing contacts to bucket</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {this.state.contacts.map((item, index) =>
                <div key={index}>
                  <Checkbox label={item.firstName + ' ' + item.lastName} onChange={() => this.handleChange(index)} checked={this.state.contacts[index].checked} />
                  <br />
                </div>
              )}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.props.close(false)}>
              Cancel
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={() => this.props.close(this.state.contacts)} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default AddExistingModal
