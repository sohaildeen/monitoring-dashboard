import React, {Component} from 'react'
import {PageHeader, Button, Row, Col,Badge} from "react-bootstrap";
import './ViewQueues.css';
import { getQueues } from "../../libs/aws/sqs";

export default class SqsViewQueues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queues: []
    }
  }
  async componentDidMount() {
    try {
      console.log(`componentDidMount`);
      const results = await getQueues();
      console.log(`results are in`);
      console.log(`results = ${JSON.stringify(results)}`)
      this.setState(prevState => ({
        queues: [
          ...prevState.queues.concat(results)
        ]
      }))
      console.log("this.state.queues")
      
      console.log(this.state.queues)

    } catch (e) {
      alert(e);
    }
  }

  
  renderQueuesList(queues) {
    //
    if (queues.length === 0) 
      return <Row className="show-grid" key="NotFound">
        <Col xs={12} md={12}>No Queues Found! </Col>
      </Row>
    else 
      return queues.map((queue, i) => {
        const queueName = queue.QueueUrl.split("/").pop();
        return  <Row className="show-grid" key={queue.Attributes.QueueArn}>
          <Col xs={6} md={9}>
            <Button bsStyle="link"
              href={`/sqs/queue/${queueName}`}
              onClick={this.handleQueueClick}>
              {queueName}
            </Button>
          </Col>
          <Col xs={2} md={1}><div className="text-center"><Badge>{queue.Attributes.ApproximateNumberOfMessagesNotVisible}</Badge></div></Col>
          <Col xs={2} md={1}><div className="text-center"><Badge>{queue.Attributes.ApproximateNumberOfMessages}</Badge></div></Col>
          <Col xs={2} md={1}><div className="text-center"><Badge>{queue.Attributes.ApproximateNumberOfMessagesDelayed}</Badge></div></Col>
        </Row>

      });
    }
  handleQueueClick = event => {
    event.preventDefault();
    this
      .props
      .history
      .push(event.currentTarget.getAttribute("href"));
  }
  render() {
    return (
      <div className="ViewQueues">
        <PageHeader>Queues</PageHeader>
        <div className="list-container">
          <Row >
            <Col xs={6} md={9}>Queue Name</Col>
            <Col xs={2} md={1}>Messages</Col>
            <Col xs={2} md={1}>Messages In Flight</Col>
            <Col xs={2} md={1}>Messages To Be Delivered</Col>
          </Row>
          {this.renderQueuesList(this.state.queues)}
          </div>
      </div>
    )
  }
}
