const path = require('path');

var generate = require('../index');

generate({
  output: '/opt/linux-remote/ssl',
  commonName: '149.129.62.26',
  O: 'AAA ssl-self-signed of demo',
  end(err){
    if(err) {
      return console.error('err', err);
    }
    console.log('ok');
  }
});