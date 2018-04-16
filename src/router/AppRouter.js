import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import DrawPattern from '../components/DrawPattern/DrawPattern';
import ConfirmPattern from '../components/ConfirmPattern/ConfirmPattern';


const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Header />
        <Switch>
            <Route path="/" component={DrawPattern} exact={true} />
            <Route path="/confirm" component={ConfirmPattern} />
            <Redirect to='/' />
         </Switch>
      <Footer />
    </div>
  </BrowserRouter>
);

export default AppRouter;