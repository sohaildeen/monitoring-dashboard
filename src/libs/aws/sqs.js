import AWS from 'aws-sdk';
import config from "../../config";

function Configure() {
  AWS.config.accessKeyId = config.iamUser.ACCESS_KEY;
  AWS.config.secretAccessKey = config.iamUser.SECRET_ACCESS_KEY;
  AWS.config.region = config.iamUser.REGION;
}
async function promiseToListQueues(sqs, queueNamePrefix) {
  var listQueuesRequest = {
    QueueNamePrefix: queueNamePrefix
  };

  return new Promise(function (resolve, reject) {
    sqs
      .listQueues(listQueuesRequest, function (err, data) {
        if (err) 
          reject(err)
        console.log("get urls response")
        console.log(data)
        resolve(data.QueueUrls);
      });
  })
}
export async function getQueues(queueNamePrefix) {
    Configure();

    var sqs = new AWS.SQS();

    return await promiseToListQueues(sqs, queueNamePrefix)
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
