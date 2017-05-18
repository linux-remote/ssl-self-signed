var sss = require('../index');
const https = require('https');

sss.getOrCreateCA(__dirname, function(err, CA){
  if(err) return console.error('getOrCreateCA Error', err);
  console.log('CA', CA);
  /*
  返回的是是文件路径，其中cert可导入到浏览器。
  {key: 'someresolvepath/ca.key', 
  cert: 'someresolvepath/ca.crt'}
  */
  sss.getOrSign({
    output: __dirname,
    commonName: '127.0.0.1',
    CA,
    end: function(err, result){
      if(err) return console.error('getOrSign Error', err);
      console.log('result', result);
      /*
      返回的是是文件buffer，可直接用
      {key: <Buffer>, 
      cert: <Buffer>}
      */
      // https.createServer(result, (req, res) => {
      //   res.writeHead(200);
      //   res.end('hello world\n');
      // }).listen(8000);
    }
  })
})