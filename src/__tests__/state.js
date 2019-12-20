import React from 'react'
import {render} from '@testing-library/react'
import user from '@testing-library/user-event'

import {FavoriteNumber} from '../favorite-number'
test('entering an inbalid value shows an error message', () => {
  const {getByLabelText, getByRole} = render(<FavoriteNumber />)
  const input = getByLabelText(/favorite number/i)
  //fireEvent.change(input, {target: {value: '10'}})
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
