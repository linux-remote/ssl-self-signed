# ssl-self-signed
Generate 100-year self-signed ssl certificates for your domain/IP.
## Requested
Linux

[OpenSSL](https://www.openssl.org)
## Install
`npm install ssl-self-signed`
## Examples
```js
var sss = require('ssl-self-signed');
// auto generate CA
sss({
  output: __dirname, 
  commonName: '192.168.56.101',
  end(){
    if(err){
      return console.error(err);
    }
    console.log('ok');
  }
});
```
Generate files：
- `CA.key` CA's private key.
- `CA.crt` Import into browser.
- `server.crt`和`server.key` use for server.
### opts
- `CA` If not set(`undefined`): If under the ouput not have `CA.key` and `CA.crt`, It will generate CA. otherwise It will use `CA.key` and `CA.crt` under the ouput. default `undefined`.
  
  If is Object: It will use you provide'CA,
  - `key` CA's private key path.
  - `cert` CA's cert file path.
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
  end(err){
    if(err){
      return console.error(err);
    }
    console.log('ok');
  }
});
```
## Import CA:
Import `CA.crt` into browsers(should put it into 'Trusted Root Certification Authorities' place). Some guide like: [window-chrome-import-guide](win-chrome-import-guide.md)

Also need restart your browser.

<!-- ## Demo:
1. Download [CA-of-demo.crt](https://raw.githubusercontent.com/linux-remote/ssl-self-signed/master/CA-of-demo.crt)
2. Import into browsers(put it into 'Trusted Root Certification Authorities' place). Some guide like: [window-chrome-import-guide](win-chrome-import-guide.md)
3. Restart your browser.
4. Visit https://149.129.62.26:3002 -->
