import React, { Component } from 'react'
import { Popup, Button, Header, Image, Modal } from 'semantic-ui-react'

class CreateContactModal extends Component {
  //Props:
  //open, close, actionType, field, modalContent
  render() {
    return (
      <div>
        <Modal dimmer={false} open={this.props.open} onClose={this.props.close} closeOnDocumentClick={true}>
          <Modal.Header>Create a Contact</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <form>
                stuff goes here
              </form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.props.close}>
              Cancel
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.props.close.bind(this, formFields)} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default CreateContactModal
