import React from 'react'
import ReactDOM from 'react-dom'
import CreateContactModal from './CreateContactModal'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<CreateContactModal />, div)
})
