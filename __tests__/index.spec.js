import * as React from 'react'
import { mount, shallow } from 'enzyme'
import SpacexPage from '../pages/index'
import { data } from '../mock'

beforeAll(() => {
  global.fetch = jest.fn()
  //window.fetch = jest.fn(); if running browser environment
})

// src/utils/currency.test.js
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  })
)

describe('Pages', () => {
  describe('SpaceX', () => {
    it('should render without throwing an error', () => {
      const wrap = mount(<SpacexPage missions={data} />)
      expect(wrap).toMatchSnapshot()
      expect(wrap.find('button').length).toBe(11)
      expect(wrap.find({ className: 'card' }).length).toBe(10)
    })

    it('Filter the result', async () => {
      const wrap = mount(<SpacexPage missions={data} />)
      wrap.find('button').last().simulate('click')
      wrap.update()
      expect(wrap.props().missions.length).toBe(10)
    })
  })
})
