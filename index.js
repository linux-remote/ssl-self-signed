var {exec} = require('child_process');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
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
  const isOtherCA = (typeof CA === 'object');
  if(isOtherCA){
    CAKey = CA.key;
    CACert = CA.cert;
  } else {
    try {
      fs.statSync(path.join(dir, CAKey));
      fs.statSync(path.join(dir, CAKey));
    } catch(e) {
      //生成两个CA文件。
      var _CACmd = `openssl req -x509 -new -nodes -newkey rsa:${bit} -keyout ${CAKey} -sha256 -days ${days} -out ${CACert} -subj "${SUBJ}"`;

      generateCA = function(callback){
        exec(_CACmd, {cwd: dir}, callback);
      }
    }
    
  }

  //CA over;
  const serverFilePath = path.join(dir, commonName);
  // 创建 以 commonName 为名字的文件夹
  mkdirp.sync(serverFilePath);
  //生成两个文件 server.csr, server.key
  //server csr
  var serverCsrCmd = `openssl req -new -sha256 -nodes -out ${commonName}/server.csr -newkey rsa:${bit} -keyout ${commonName}/server.key -subj "${SUBJ}/CN=${commonName}"`;


  //签证
  var serverCrtCmd = `openssl x509 -req -in ${commonName}/server.csr -CA ${CACert} -CAkey ${CAKey} -CAcreateserial -out ${commonName}/server.crt -days ${days} -sha256 -extfile v3.ext`;

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
  ], function(err, result) {
    if(err) {
      return callback(err);
    }
    if(isOtherCA) {
      fs.writeFile(path.join(serverFilePath, 'otherCA.json'), JSON.stringify(CA, null, ' '), callback);
    } else {
      callback(null, result);
    }
  });
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
  if(/[a-z]/.test(param) && param.indexOf('.') !== -1){
    return 'DNS';
  }else{
    return 'IP';
  }
}