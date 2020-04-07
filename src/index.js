import React from 'react'
import ReactDOM from 'react-dom'
import AppNavigator from 'navigations'
import * as serviceWorker from 'serviceWorker'
import 'styles.less'

ReactDOM.render(
  <AppNavigator />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
