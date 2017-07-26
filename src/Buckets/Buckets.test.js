import React from 'react'
import ReactDOM from 'react-dom'
import Buckets from './Buckets'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Buckets />, div)
})
