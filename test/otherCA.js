const path = require('path');

var generate = require('../index');

generate({
  output: path.join(__dirname, 'other-ca'),
  commonName: '192.168.56.103',
  CA: {
    cert: path.join(__dirname, 'other-ca/CA.crt'),
    key: path.join(__dirname, 'other-ca/CA.key')
  },
  end(err){
    if(err) {
      return console.error('err', err);
    } 
    console.log('ok');
  }
});