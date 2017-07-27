import React from 'react'
import ReactDOM from 'react-dom'
import AddExistingModal from './AddExistingModal'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<AddExistingModal />, div)
})
