import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'

import {Redirect as MockRedirect} from 'react-router'

import {build, fake, sequence} from 'test-data-bot'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-markup'
jest.mock('../api')
jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

beforeEach(() => {})

afterEach(() => {
  jest.clearAllMocks()
})

const postBuilder = build('Post').fields({
  title: fake(f => f.lorem.words()),
  content: fake(f => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake(f => [f.lorem.words(), f.lorem.words(), f.lorem.words()]),
})

const userBuilder = build('User').fields({
  id: sequence(s => `user-${s}`),
})

function renderEditor() {
  const fakeUser = userBuilder()

  const utils = render(<Editor user={fakeUser} />)

  const fakePost = postBuilder()
  utils.getByLabelText(/title/i).value = fakePost.title
  utils.getByLabelText(/content/i).value = fakePost.content
  utils.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  const submitButton = utils.getByText(/submit/i)

  return {
    ...utils,
    submitButton,
    fakeUser,
    fakePost,
  }
}
test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  const {submitButton, fakePost, fakeUser} = renderEditor()
  const preDate = new Date().getTime()

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })

  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  const postDate = new Date().getTime()

  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)
  expect(mockSavePost).toHaveBeenCalledTimes(1)

  await wait(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
  expect(MockRedirect).toHaveBeenCalledTimes(1)
})

test('renders an error message from the server', async () => {
  const testError = 'test error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})

  const {submitButton, findByRole} = renderEditor()

  fireEvent.click(submitButton)

  const postError = await findByRole('alert')
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).not.toBeDisabled()
})
