'use strict';
const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const tableName = 'mini-dropbox'
const bucketName = 'mini-dropbox'

module.exports.created = (event) => {

  event.Records.forEach((record) => {

    const params = {
      TableName: tableName,
      Item: {
        id: record.s3.object.key,
        name: record.s3.object.key,
        size: record.s3.object.size,
        created: record.eventTime,
        removed: '-',
        record: record
      }
    }
  
    dynamoDb.put(params, (err, results) => {
      if (err) {
        console.error(err)
        return
      }

      console.log(results)
    })
  })
}

module.exports.removed = (event) => {

  event.Records.forEach((record) => {

    const params = {
      TableName: tableName,
      Key: {
        id: record.s3.object.key
      },
      UpdateExpression: 'SET removed = :val',
      ExpressionAttributeValues: {
        ':val': record.eventTime
      },
      ReturnValues: 'UPDATED_NEW'
    }

    dynamoDb.update(params, (err, results) => {
      if (err) {
        console.error(err)
        return
      }

      console.log(results)
    })
  })
}

module.exports.listFiles = (event, context, callback) => {

  const params = {
      TableName: tableName
  }

  dynamoDb.scan(params, (err, results) => {
      if (err) {
          console.error(err)
          callback(err)
          return
      }

      const response = {
          statusCode: 200,
          headers: {
              "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(results.Items)
      }

      callback(null, response)
  })
}

module.exports.addFile = (event, context, callback) => {
 
  callback(null, {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': '*',
      },
    body: JSON.stringify(event)
  })
  
  return
 

  // var s3 = new AWS.S3()
  // var params = {
  //     Bucket : bucketName,
  //     Key : data,
  //     Body : event.body
  // }

  // s3.putObject(params, function(err, data) {
  //   if (err)
  //     callback(null, {
  //       statusCode: 500,
  //       headers: {
  //           'Access-Control-Allow-Origin': '*',
  //           'Access-Control-Allow-Credentials': '*',
  //         },
  //       body: JSON.stringify(err)
  //   })
  //   else
  //     callback(null, {
  //       statusCode: 200,
  //       headers: {
  //           'Access-Control-Allow-Origin': '*',
  //           'Access-Control-Allow-Credentials': '*',
  //         },
  //       body: JSON.stringify(data)
  //     })  
  // })
}

module.exports.removeFile = (event, context, callback) => {

  const data = JSON.parse(event.body)

  var s3 = new AWS.S3()
  var params = {
    Key : data.id,
    Bucket : bucketName
  }

  s3.deleteObject(params, function(err, data) {
    if (err)
      callback(null, {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': '*',
          },
        body: JSON.stringify(err)
      })
    else
      callback(null, {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': '*',
          },
        body: JSON.stringify(data)
      })  
  })
}