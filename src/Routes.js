import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import ViewQueues from "./containers/SQS/ViewQueues";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/sqs/queues/" exact component={ViewQueues} />
  </Switch>;