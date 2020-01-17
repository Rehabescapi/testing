import React from 'react'
import {createStore} from 'redux'
import {render, fireEvent} from '@testing-library/react'
import {Provider} from 'react-redux'

import {store as AppStore} from '../redux-store'
import {Counter} from '../redux-counter'
import {reducer} from '../redux-reducer'
test('can render with redux with default', () => {
  const {getByLabelText, getByText} = render(
    <Provider store={AppStore}>
      <Counter />
    </Provider>,
  )

  fireEvent.click(getByText('+'))
  expect(getByLabelText(/count/i)).toHaveTextContent('1')
})

test('can render with redux with', () => {
  const store = createStore(reducer, {count: 3})
  const {getByLabelText, getByText} = render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  )

  fireEvent.click(getByText('-'))
  expect(getByLabelText(/count/i)).toHaveTextContent('2')
})
