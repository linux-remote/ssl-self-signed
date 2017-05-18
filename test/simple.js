var sss = require('../index');
const https = require('https');

sss.getOrCreate(__dirname, '127.0.0.1', function(err, result){
  if(err) return console.error('getOrCreateCA Error', err);
  console.log('CA', result);
})