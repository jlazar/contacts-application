import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'

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

  //Props:
  //open, close, actionType, field, modalContent
  addEmail() {
    this.state.formData.emailAddresses.push({});
    this.setState({
      formData: this.state.formData
    });
  }
  handleChange(event, formKey) {
    const formData = this.state.formData
    formData[formKey] = event;

    this.setState({
      formData: formData
    });
  }

  handleEmailChange(event, formKey, index) {
    const formData = this.state.formData
    formData.emailAddresses[index][formKey] = event;

    this.setState({
      formData: formData
    });
  }

  render() {
    let formData = this.state.formData;
    if(!formData.emailAddresses){
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
                  <Form.Input required label='First name' placeholder='First name' onChange={(e) => this.handleChange(e.target.value, 'firstName')} value={formData.firstName}/>
                  <Form.Input required label='Last name' placeholder='Last name' onChange={(e) => this.handleChange(e.target.value, 'lastName')} value={formData.lastName}/>
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
