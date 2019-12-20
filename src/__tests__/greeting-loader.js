import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'
import {GreetingLoader} from '../greeting-loader-02-dependency-injection'

jest.mock('../api')

test('Loads greetings on click', () => {
  const testGreeting = 'TEST_GREETING'
  const mockLoadGreeting = jest.fn()
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})
  const {getByLabelText, getByText} = render(
    <GreetingLoader loadGreeting={mockLoadGreeting} />,
  )
  const nameInput = getByLabelText(/name/i)
  const loadButton = getByText(/load/i)

  nameInput.value = 'Mary'
  fireEvent.click(loadButton)
  expect(mockLoadGreeting).toHaveBeenLastCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  wait(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent('testGreeting'),
  )
})
