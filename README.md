# ssl-self-signed
自动生成ssl自签名证书。
## 环境
`linux`, `openssl`
## 安装
`npm install ssl-self-signed`

## API
### getOrCreateCA(output[, opts], callback)
获取或创建CA。
- `output` string 是要输出的文件夹。
- **opts** Object:
  - `days` number 过期的天数。_默认_ `36500`
  - `bit` number ssl加密的强度。_默认_ `2048`
- `callback` function 回调。

此方法第一次将会在`output`目录下生成`ssl-self-signed-CA`文件夹。
如果想重新生成CA可手动删除。
### getOrSign(config)
获取或签名证书。
**config** Object
  - `output` string 是要输出的文件夹。**必填**
  - `commonName` string 网站域名或IP。 **必填**
  - `CA` Object **必填**
    - `key` string CA密钥路径
    - `cert` string CA证书路径
  - `days` number 过期的天数。_默认_ `36500`
  - `bit` number ssl加密的强度。_默认_ `2048`
  - `end` function 回调。

此方法第一次将会在`output`目录下生成`ssl-self-signed-CN-${commonName}`文件夹。
如果想重新签名请手动删除。
### 示例:
```js
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
      https.createServer(result, (req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
      }).listen(8000);
    }
  })
})
```
### getOrCreate(output, commonName[, opts], callback)
使用以上两种方法的简单方法。
- `output` string 是要输出的文件夹。
- `commonName` string 网站域名或IP。
- **opts** Object:
  - `days` number 过期的天数。_默认_ `36500`
  - `bit` number ssl加密的强度。_默认_ `2048`
- `callback` function 回调。

### 示例:
```js
var sss = require('../index');
const https = require('https');

sss.getOrCreate(__dirname, '127.0.0.1', function(err, result){
  if(err) return console.error('getOrCreateCA Error', err);
  console.log(result);
  /*
  { key: <Buffer ...>,
    cert: <Buffer ...>,
    caCertPath: 'someresolvepath/ca.crt'}
  */
})
```