import React, { FC } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';

import UserList from '@client/pages/UserList';
import Home from '@client/pages/Home';

const App: FC = () => (
  <>
    <CssBaseline />
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/user_list" component={UserList} />
      </Switch>
    </BrowserRouter>
  </>
);

export default hot(App);
