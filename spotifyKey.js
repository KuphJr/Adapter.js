var request = require("request");

var client_id = '128fc8435abd43eb8620b2edcf315a2c';
var client_secret = '0408f2a79dcd42819959d733c4c30547';

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var token = body.access_token;
    console.log(token);
  }
});