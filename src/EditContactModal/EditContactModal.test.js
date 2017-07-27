import React from 'react'
import ReactDOM from 'react-dom'
import EditContactModal from './EditContactModal'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<EditContactModal />, div)
})
