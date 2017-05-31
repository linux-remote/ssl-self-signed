var generate = require('../index');
generate({
  output: __dirname,
  commonName: '192.168.56.101',
  CA: true,
  end(err){
    if(err) return console.error('err', err);
    console.log('ok');
  }
});