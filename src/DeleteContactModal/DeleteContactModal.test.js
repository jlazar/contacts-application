import React from 'react'
import ReactDOM from 'react-dom'
import DeleteContactModal from './DeleteContactModal'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<DeleteContactModal />, div)
})
