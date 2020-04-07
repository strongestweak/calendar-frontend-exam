import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Provider} from 'react-redux'
import Reducers from 'reducers'
import Layout from 'layout'

const Home = React.lazy(() => import('containers/home'))

export default () => (
  <Provider store={Reducers}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Layout(Home)} />
      </Switch>
    </BrowserRouter>
  </Provider>
)
