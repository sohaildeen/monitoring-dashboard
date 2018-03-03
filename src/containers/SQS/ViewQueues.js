import React, {Component} from 'react'
import {PageHeader, ListGroup, ListGroupItem} from "react-bootstrap";
import './ViewQueues.css';
import AWS from 'aws-sdk';
import config from "../../config";


export default class SqsViewQueues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queues: []
    }
  }
  async componentDidMount() {
    try {
      this.getQueues();
      //console.log(`results = ${results}`)
      //this.setState({queues: results});
    } catch (e) {
      alert(e);
    }
  }

  async getQueues() {
    AWS.config.accessKeyId = config.iamUser.ACCESS_KEY;
    AWS.config.secretAccessKey = config.iamUser.SECRET_ACCESS_KEY;
    AWS.config.region = config.iamUser.REGION;

    var sqs = new AWS.SQS();
    var params = {
      QueueNamePrefix: ''
    };
    var self = this;
    await sqs.listQueues(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data)
        console.log(data.QueueUrls)
        
        self.setState({queues: data.QueueUrls});
      }
    });

  }
  renderQueuesList(queues) {
    return []
      .concat(queues)
      .map((queueUrl, i) => <ListGroupItem key={queueUrl} href={`/sqs/queue/${queueUrl}`} onClick={this.handleQueueClick} 
      //header={queueUrl}
      >
        {queueUrl}
      </ListGroupItem>);
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
      <div className="queues">
        <PageHeader>Queues</PageHeader>
        <ListGroup>
          {this.renderQueuesList(this.state.queues)}
        </ListGroup>
      </div>
    )
  }
}
