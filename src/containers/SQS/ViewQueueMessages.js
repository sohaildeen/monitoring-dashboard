import React, { Component } from 'react'
import {PageHeader, Button, Row, Col,Badge} from "react-bootstrap";
import './ViewQueueMessages.css';

export default class ViewQueueMessages extends Component {
  constructor(props) {
    super(props);
    
    this.state={
      messages:[]
    }
  }
  
  render() {
    return (
      <div className="ViewQueueMessages">
        <h3><span class="glyphicon glyphicon-tasks" aria-hidden="true"></span> {this.props.match.params.name}</h3>
        <div className="list-container">
          <Row >
            <Col xs={3} md={2}>Message Id</Col>
            <Col xs={5} md={8}>Message</Col>
            <Col xs={2} md={1}>Delete</Col>
            <Col xs={2} md={1}>Replay</Col>
          </Row>
          {
           // this.renderQueueMessages(this.state.queues)
            }
          </div>
      </div>
    )
  }
}
