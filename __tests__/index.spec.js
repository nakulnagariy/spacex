import * as React from 'react'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import IndexPage from '../pages/index'
import { data } from '../mock'

beforeAll(() => {
  global.fetch = jest.fn()
  //window.fetch = jest.fn(); if running browser environment
})

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(data),
  })
)

describe('Pages', () => {
  describe('SpaceX', () => {
    it('should render without throwing an error', () => {
      const wrap = mount(<IndexPage missions={data} />)
      expect(wrap).toMatchSnapshot()
      expect(wrap.find('button').length).toBe(12)
      expect(wrap.find({ className: 'card' }).length).toBe(11)
    })

    // it('Filter the result', async () => {
    //   const wrap = act(async () => {
    //     await mount(<IndexPage missions={data} />)
    //   })
    //   // console.log(wrap.props())
    //   act(() => {
    //     wrap.find('button').at(1).props().onClick()
    //   })
    //   // console.log(wrap.props())
    //   // expect(wrap.props().missions.length).toBe(10)
    // })
  })
})
