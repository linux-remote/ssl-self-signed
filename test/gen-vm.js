const path = require('path');

var generate = require('../index');

generate({
  output: '/mnt/common/ssl',
  commonName: '192.168.56.101',
  end(err){
    if(err) {
      return console.error('err', err);
    }
    console.log('ok');
  }
});