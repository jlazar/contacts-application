import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

class DeleteContactModal extends Component {
  render() {
    return (
      <div>
        <Modal dimmer={true} open={this.props.open} onClose={this.props.close} closeOnDocumentClick={true}>
          <Modal.Header>Delete this Contact</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <form>
                Are you sure you want to delete this contact?
              </form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.props.close(false)}>
              Cancel
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content="Yes" onClick={() => this.props.close(this.props.formData)} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default DeleteContactModal
