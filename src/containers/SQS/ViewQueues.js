import React, { Component } from 'react'
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import './ViewQueues.css';

export default class SqsViewQueues extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      queues:[]
    }
  }
  async componentDidMount() {
    try {
      const results = await this.queues();
      this.setState({ queues: results });
    } catch (e) {
      alert(e);
    }
  }
  
  queues() {
    return [];
  }
  renderQueuesList(queues) {
    return [{}].concat(queues).map(
      (queue, i) =>
          <ListGroupItem
              //key={queue.arn}
              //href={`/sqs/queue/${queue.arn}`}
              //onClick={this.handleQueueClick}
              //header={queue.name.trim().split("\n")[0]}
            >
              {
                //"Created: " + new Date(queue.createdAt).toLocaleString()
              }
            </ListGroupItem>    
    );
  }
  handleQueueClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }
  render() {
    return (
      <div className="queues">
        <PageHeader>Queues</PageHeader>
        <ListGroup>
          {this.renderQueuesList(this.state.queues)}
        </ListGroup>
      </div>
    )
  }
}
