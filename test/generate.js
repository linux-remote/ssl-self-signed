const path = require('path');

var generate = require('../index');

generate({
  output: path.join(__dirname, 'output'),
  commonName: '192.168.56.102',
  end(err){
    if(err) {
      return console.error('err', err);
    } 
    console.log('ok');
  }
});