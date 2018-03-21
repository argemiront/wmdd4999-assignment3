import {config, S3} from 'aws-sdk'
import keys from './aws-keys'
import {map} from 'lodash'

const accessKeyId = keys.accessKeyId
const secretAccessKey = keys.secretAccessKey
const uploadBucket = keys.uploadBucket
const region = keys.region

config.update({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
})

config.setPromisesDependency(Promise)

export const s3UploadBucket = new S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: uploadBucket
  }
})

export const uploadFiles = (files) => {
  return Promise.all(
    map(files, file => {
      return s3UploadBucket.putObject({
        Key: file.name,
        Body: file
      }).promise()
    })
  )
}
