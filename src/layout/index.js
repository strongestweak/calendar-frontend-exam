import React from 'react'
import {
  Icon,
  Spin,
  Layout,
} from 'antd'

import './styles.less'

const {Content} = Layout

const Fallback = () => {
  return (
    <div className="spinner-wrapper">
      <Spin
        indicator={<Icon type="loading" className="spin-icon" spin />}
      />
    </div>
  )
}

const AppLayout = BaseComponent => {
  const LayoutWrapper = props => {
    const {match: {path}} = props
    const [, uri] = path.split('/')

    if (uri === 'signin') {
      return (
        <div className={`${uri || 'home'}-container`}>
          <div className="layout-content">
            <React.Suspense fallback={<Fallback />}>
              <BaseComponent {...props} />
            </React.Suspense>
          </div>
        </div>
      )
    }

    return (
      <Layout className={`${uri || 'home'}-container`}>
        <Content className="layout-content">
          <React.Suspense fallback={<Fallback />}>
            <BaseComponent {...props} />
          </React.Suspense>
        </Content>
      </Layout>
    )
  }
  return LayoutWrapper
}

export default AppLayout
