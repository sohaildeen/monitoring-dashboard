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
      const results = await this.getQueues();
      console.log(`results = ${JSON.stringify(results)}`)
      this.setState(prevState => ({
        queues: [...prevState.queues, results]
      }))

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

    return new Promise(function (resolve, reject) {
      sqs
        .listQueues(params, function (err, data) {
          if (err) 
            reject(err)
            console.log("get urls response")
            console.log(data)
          resolve(data.QueueUrls);
        });
    }).then(
      (urls)=>{
        var params = {
          QueueUrl: urls[0], /* required */
          AttributeNames: [
            "All" /* more items */
          ]
        };
        return new Promise(function (resolve, reject) {
          sqs
          .getQueueAttributes(params, function (err, data) {
            if (err) 
              reject(err)
            data['QueueUrl'] = params.QueueUrl;
            console.log("get attributes response")
            console.log(data)
            resolve(data);
          });
        });

      }
    );

  }
  renderQueuesList(queues) {
    //
    return [{}]
      .concat(queues)
      .map((queue, i) => {
      if(i===0) 
      return <ListGroupItem
      key="new"
      href="/"
      onClick={this.handleNoteClick}
    >
      No Queues Found!
    </ListGroupItem>
      return <ListGroupItem
        key={queue.Attributes.QueueArn}
        href={`/sqs/queue/${queue.QueueUrl.split("/").pop()}`}
        onClick={this.handleQueueClick}
        header={queue.QueueUrl.split("/").pop()}>
      </ListGroupItem>});
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
