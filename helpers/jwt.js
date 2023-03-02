var { expressjwt: jwt } = require("express-jwt");

function authJwt(){
  const secret = process.env.secret
  return jwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
      '/api/v1/users/login'
    ]
  });
}

async function isRevoked(req, token){
  if (token.payload.isAdmin == false) {
    return true;
  }
  return false;
}

module.exports = authJwt