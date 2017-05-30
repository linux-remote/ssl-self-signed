# ssl-self-signed
自动生成ssl自签名证书。
## 环境
`linux`, `openssl`
## 安装
`npm install ssl-self-signed`
### 示例:
```js
var generate = require('ssl-self-signed');

generate({
  output: './test',
  commonName: '192.168.56.101',
  end(){
    console.log('ok');
  }
});
```