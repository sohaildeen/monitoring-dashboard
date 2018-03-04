import React, {Component} from 'react'
import {PageHeader, Button, Grid, Row, Col} from "react-bootstrap";
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
      console.log(`componentDidMount`);
      const results = await this.getQueues();
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

  async getQueues() {
    AWS.config.accessKeyId = config.iamUser.ACCESS_KEY;
    AWS.config.secretAccessKey = config.iamUser.SECRET_ACCESS_KEY;
    AWS.config.region = config.iamUser.REGION;

    var sqs = new AWS.SQS();
    var params = {
      QueueNamePrefix: ''
    };

    return await new Promise(function (resolve, reject) {
      sqs
        .listQueues(params, function (err, data) {
          if (err) 
            reject(err)
          console.log("get urls response")
          console.log(data)
          resolve(data.QueueUrls);
        });
    })
    .then((urls) => {
      const promisesStack=[];
      urls.forEach(url => {
        console.log("for each url")
        console.log(url)

        var params = {
          QueueUrl: url, 
          AttributeNames: ["All"]
        };
        console.log("adding promise to array")
        promisesStack.push( new Promise(function (resolve, reject) {
          sqs
            .getQueueAttributes(params, function (err, data) {
              if (err) 
                reject(err)
              data['QueueUrl'] = params.QueueUrl;
              console.log("get attributes response")
              console.log(data)
              resolve(data)
            })
        }))
        console.log("finished adding promise to array")

      });

      return Promise.all(promisesStack).then(data => {
        console.log("all promises");
        console.log(data);
        return data;
      });
          

    })

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
          <Col xs={8} md={8}>
            <Button 
              href={`/sqs/queue/${queueName}`}
              onClick={this.handleQueueClick}
            >
              {queueName}
            </Button>
          </Col>
          <Col xs={1} md={1}>{queue.Attributes.ApproximateNumberOfMessages}</Col>
          <Col xs={1} md={1}>{queue.Attributes.ApproximateNumberOfMessagesNotVisible}</Col>
          <Col xs={1} md={1}>{queue.Attributes.ApproximateNumberOfMessagesDelayed}</Col>
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
      <div className="queues">
        <PageHeader>Queues</PageHeader>
        <Grid>
          <Row className="show-grid">
            <Col xs={8} md={8}>Queue</Col>
            <Col xs={1} md={1}>Messages</Col>
            <Col xs={1} md={1}>Messages In Flight</Col>
            <Col xs={1} md={1}>Messages To Be Delivered</Col>
          </Row>
          {this.renderQueuesList(this.state.queues)}
        </Grid>
      </div>
    )
  }
}
