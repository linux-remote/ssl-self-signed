var {exec, execSync} = require('child_process');
var fs = require('fs');
var path = require('path');

var sas = require('sas');

// //if not have openssl, the program will stop in next line;
// try {
//   execSync('openssl version');
// }catch(e){
//   throw new Error('ssl-self-signed need openssl');
// }


function _commonOptsDefine(opts){
  let {C, O , days, bit} = opts;
  C = C || 'CN';
  O = O || 'AAA ssl-self-signed';
  let OU = O + ' ' + Date.now();
  days = days || 365* 100;
  bit = bit || 2048;
  return {C, O, OU, days, bit};
}

function generate(opts){

  //必填
  const {commonName, CA} = opts;
  const dir = opts.output;
  

  const {C, O, OU, days, bit} = _commonOptsDefine(opts);
  const SUBJ = `/C=${C}/ST=ST/L=L/O=${O}/OU=${OU}`;
  const callback = opts.end;
  let CAKey = 'CA.key', CACert = 'CA.crt' , generateCA;

  if(!CA){
    //生成两个CA文件。
    var _CACmd = `openssl req -x509 -new -nodes -newkey rsa:${bit} -keyout ${CAKey} -sha256 -days ${days} -out ${CACert} -subj "${SUBJ}"`;

    generateCA = function(callback){
      exec(_CACmd, {cwd: dir}, callback);
    }
  }else if(typeof CA === 'object'){
    CAKey = CA.key;
    CACert = CA.cert;
  }

  //CA over;

  //生成两个文件 server.csr, server.key
  //server csr
  var serverCsrCmd = `openssl req -new -sha256 -nodes -out server.csr -newkey rsa:${bit} -keyout server.key -subj "${SUBJ}/CN=${commonName}"`;


  //签证
  var serverCrtCmd = `openssl x509 -req -in server.csr -CA ${CACert} -CAkey ${CAKey} -CAcreateserial -out server.crt -days ${days} -sha256 -extfile v3.ext`;

  function generateServerCsr(callback){
    exec(serverCsrCmd, {cwd: dir}, callback);
  }

  //生成 extfile v3.ext
  const SVN_prefix = _parseSAN(commonName);
  function generateExtFile(callback){
    //alt_names_arr = alt_names_arr.join('\n');
    var arr = [
      'authorityKeyIdentifier=keyid,issuer',
      'basicConstraints=CA:FALSE',
      'keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment',
      'subjectAltName = @alt_names',
      '',
      '[alt_names]',
      `${SVN_prefix}.1 = ${commonName}`
    ];
    fs.writeFile(path.join(dir, 'v3.ext'), arr.join('\n'), callback);
  }

  function sign(callback){
    exec(serverCrtCmd, {cwd: dir}, callback);
  }

  sas([
    {
      generateCA,
      generateServerCsr,
      generateExtFile
    },
    sign
  ], callback);
}

module.exports = generate;

// generate({
//   output: './test',
//   commonName: '192.168.56.101',
//   end(){
//     console.log('ok');
//   }
// });

function _parseSAN(param){
  if(/[a-z]/.test(param)){
    return 'DNS';
  }else{
    return 'IP';
  }
}