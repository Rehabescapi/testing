import React from 'react'
import {render} from '@testing-library/react'
import {FavoriteNumber} from '../favorite-number'

test('renders a number input with a label "Favorite Number"', () => {
  const {getByLabelText} = render(<FavoriteNumber />)

  const input = getByLabelText(/favorite Number/i)
  expect(input).toHaveAttribute('type', 'number')
})
