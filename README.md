# ssl-self-signed
ssl self-signed certificate generator. not miss subjectAltName problem. 
## 环境
`linux`, `openssl`
## INstall
`npm install ssl-self-signed`
## Examples
```js
var sss = require('ssl-self-signed');

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

### Use other CA:
```js
var sss = require('ssl-self-signed');

sss({
  output: __dirname,
  commonName: '192.168.56.101',
  CA: {
    key: 'somePath/CA.key',
    cert: 'somePath/CA.crt'
  },
  C: 'CN', // Must be the same as CA, otherwise will be get a error.
  O: 'AAA', // Must be the same as CA, otherwise will be get a error.
  end(){
    console.log('ok');
  }
});
```
### opts
- `C`: Country default `"CN"`
- `O`: Organization default `"AAA ssl-self-signed"`
- `bit`: default `2048`
- `days`: default `365 * 100`
