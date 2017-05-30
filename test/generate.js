var generate = require('../index');
generate({
  output: __dirname,
  commonName: '192.168.56.101',
  end(){
    console.log('ok');
  }
});