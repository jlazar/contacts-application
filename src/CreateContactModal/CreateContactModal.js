import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'

/**
* @name CreateContactModal
* @desc Create Contact Modal Component that displays the form for creating a new contact
* @returns {void}
*/
class CreateContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.formData
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      formData: props.formData
    });
  }

  /**
  * @name addEmail
  * @desc Creates a new email for the contact
  * @returns {void}
  */
  addEmail() {
    this.state.formData.emailAddresses.push({});
    this.setState({
      formData: this.state.formData
    });
  }

  /**
  * @name handleChange
  * @desc Updates state based on changes to the form
  * @param {object} event - new form data object
  * @param {string} formKey - key in the form data to update
  * @returns {void}
  */
  handleChange(event, formKey) {
    const formData = this.state.formData
    formData[formKey] = event;

    this.setState({
      formData: formData
    });
  }

  /**
  * @name handleEmailChange
  * @desc Updates the email based on changes to the form
  * @param {object} event - new form data object
  * @param {string} formKey - key in the form data to update
  * @param {number} index - index in the form data to update
  * @returns {void}
  */
  handleEmailChange(event, formKey, index) {
    const formData = this.state.formData
    formData.emailAddresses[index][formKey] = event;

    this.setState({
      formData: formData
    });
  }

  render() {
    let formData = this.state.formData;
    if (!formData.emailAddresses) {
      formData.emailAddresses = [{}];
    }
    return (
      <div>
        <Modal dimmer={true} open={this.props.open} onClose={this.props.close} closeOnDocumentClick={true}>
          <Modal.Header>New Contact: {formData.firstName} {formData.lastName}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                {/*first and last name  */}
                <Form.Group widths='equal'>
                  <Form.Input required label='First name' placeholder='First name' onChange={(e) => this.handleChange(e.target.value, 'firstName')} value={formData.firstName} />
                  <Form.Input required label='Last name' placeholder='Last name' onChange={(e) => this.handleChange(e.target.value, 'lastName')} value={formData.lastName} />
                </Form.Group>

                {/*Contact info  */}
                {formData.emailAddresses.map((item, index) =>
                  <Form.Group key={index} >
                    <Form.Input label="Label: " placeholder='Label' onChange={(e) => this.handleEmailChange(e.target.value, 'label', index)} value={item.label} />
                    <Form.Input label="Email: " placeholder='Enter email' onChange={(e) => this.handleEmailChange(e.target.value, 'address', index)} value={item.address} />
                  </Form.Group>
                )}
                <Button onClick={this.addEmail.bind(this)}>Add Email</Button>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.props.close(false)}>
              Cancel
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={() => this.props.close(formData)} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default CreateContactModal
