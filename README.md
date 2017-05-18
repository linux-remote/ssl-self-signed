# ssl-cert-generator
自动生成ssl自签名证书。
## 环境
`linux`, `openssl`
## 安装
`npm install ssl-cert-generator`

## API
### generator(config)
**config** Object:
- `output` string 是要输出的文件夹。 **必填**
- `commonName` string 网站域名或IP。 **必填**
- `ca` object 使用外部CA，如果没有将自动生成CA。
  - `key` string CA密钥路径
  - `cert` string CA证书路径
- `end` function 回调。
- `bit` number ssl加密的强度。_默认_ `2048`

简单示例:
```js
var generator = require('ssl-cert-generator');

generator({
  output: __dirname,
  commonName: '127.0.0.1',
  end:function(err){
    if(err){
      console.error('err', err);
    }else{
      console.log('成功！');
    }
  }
});
```
然后你将会在输出目录发现：
- `ca.key` ca的密钥。
- `ca.crt` ca的证书，你可以导入到浏览器，这样浏览器就不报警了。
- `server.crt` 你的网站证书。
- `server.key` 你的网站密钥。
