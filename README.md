# ssl-self-signed
ssl self-signed certificate generator. not miss subjectAltName problem. 
## 环境
`linux`, `openssl`
## INstall
`npm install ssl-self-signed`
## Examples
```js
var sss = require('ssl-self-signed');
// auto generate CA
sss({
  output: __dirname, 
  commonName: '192.168.56.101',
  end(){
    console.log('ok');
  }
});
```
Generate files：
- `CA.key` CA's private key.
- `CA.crt` Import into browser.
- `server.crt`和`server.key` use for server.

### opts
- `CA` If not set(`undefined`): If under the ouput not have `CA.key` and `CA.crt`, It will generate CA. otherwise It will use `CA.key` and `CA.crt` under the ouput.
  
  If is Object: It will use you provide'CA,
  - `key` CA's private key path.
  - `cert` CA's cert file path.
  default `undefined`.
- `bit`: default `2048`
- `days`: default `365 * 100`
- `C`: Country default `"CN"`
- `O`: Organization default `"AAA ssl-self-signed"`


### Use other CA:
```js
var sss = require('ssl-self-signed');

sss({
  output: __dirname,
  commonName: '192.168.56.101',
  CA: {
    key: '/somePath/CA.key', //cmd path is output
    cert: '/somePath/CA.crt'
  },
  C: 'CN', // Must be the same as CA, otherwise will be get a unhandle error.
  O: 'AAA', // Must be the same as CA, otherwise will be get a unhandle error.
  end(){
    console.log('ok');
  }
});
```