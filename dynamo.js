const AWS = require("aws-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "user-api";

const getUsers = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const users = await dynamoClient.scan(params).promise();
  console.log(users);
  return users;
};

const getUserByid = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id
    }
  }
  return await dynamoClient.get(params).promise()
}
const getUserByType = async (Tipo) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "Tipo = :tipo",
    ExpressionAttributeValues: {
      ":tipo": Tipo
    }
  }
  return await dynamoClient.scan(params).promise()
}

const addOrUpdateUser = async (user) => {
  if (!user.id) {
    user.id = crypto.randomUUID();
  }
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };
  return await dynamoClient.put(params).promise();
};

const deleteUser = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id
    }
  }
  return await dynamoClient.delete(params).promise()
}

module.exports = {
  dynamoClient,
  getUsers,
  getUserByid,
  addOrUpdateUser,
  deleteUser,
  getUserByType
}