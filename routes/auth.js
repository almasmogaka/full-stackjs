const jwksRsa = require('jwks-rsa');
const HapiAuth = require('hapi-auth-jwt2');
const JWT = require('jsonwebtoken');

let user = {
    id: 1,
    name: "usernm"
  };