import * as React from 'react'
import { mount, shallow } from 'enzyme'
import IndexPage from '../pages/index'

describe('Pages', () => {
  describe('Index', () => {
    it('should render without throwing an error', function () {
      const wrap = shallow(<IndexPage />)
      console.log(wrap.props())
      // expect(wrap.find('div').text()).toBe('Hello Next.js')
    })
  })
})
