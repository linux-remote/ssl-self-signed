# ssl-self-signed
自动生成ssl自签名证书。
## 环境
`linux`, `openssl`
## 安装
`npm install ssl-self-signed`
### 示例:
```js
var sss = require('ssl-self-signed');

sss({
  output: './test',
  commonName: '192.168.56.101',
  end(){
    console.log('ok');
  }
});
```
生成的文件：
- `CA.key` 放好别认别人看。
- `CA.crt` 导入浏览器。
- `server.crt`和`server.key`服务器用。