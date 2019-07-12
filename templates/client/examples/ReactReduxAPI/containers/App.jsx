import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TodoApp from '../components/TodoApp';
import NotFound from './NotFound';

const App = () => (
  <div>
    <Router>
      <Switch>
        <Route exact path="/" component={TodoApp} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </div>
);

export default App;
