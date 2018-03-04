import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import ViewQueues from "./containers/SQS/ViewQueues";
import ViewQueueMessages from "./containers/SQS/ViewQueueMessages";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/sqs/queues/" exact component={ViewQueues} />
    <Route path="/sqs/queue/:name" exact component={ViewQueueMessages} />
    
  </Switch>;