var {execSync, exec} = require('child_process');

//if not have openssl, the program will stop in next line;
execSync('openssl version');

var sas = require('sas');
var path = require('path');
var fs = require('fs');

var DAYS = 36500;
var BIT = 2048;
var PREFIX = 'ssl-self-signed-';

function initIfNotHave(path){
  return function(callback){
    fs.stat(path, function(err, stat){
      if(err || !stat.isDirectory()){
        return callback('$reload', _mkdir);
      }
      callback('$up');
    })
  }

  function _mkdir(callback){
    fs.mkdir(path, callback);
  }
}

function removeDirOnError(err, path, callback){
  exec(`rm -rf ${path}`, function(){
    callback(err);
  });
}

exports.getOrCreateCA = function(out, opts, callback){
  if(typeof opts === 'function'){
    callback = opts;
    opts = {};
  }
  
  var dir = path.resolve(out, PREFIX + 'CA');
  var caKey = path.resolve(dir, 'ca.key');
  var caCrt = path.resolve(dir, 'ca.crt');
  var days = opts.days || DAYS;
  var bit = opts.bit || BIT;
  var OU = PREFIX + Date.now();

  const createCaKey  = cb => exec(`openssl genrsa -out ${caKey} ${bit}`, cb);

  const createCaCrt = cb => exec(
    `openssl req -new -x509 -days ${days} -key ${caKey} -out ${caCrt} -subj "/C=CN/ST=ST/L=L/O=O/OU=${OU}"`,
    cb);

  sas([
    initIfNotHave(dir),
    createCaKey,
    createCaCrt
  ], function(err){
    if(err){
      removeDirOnError(err, dir, callback);
    }else{
      callback(null, {
        key: caKey,
        cert: caCrt
      });
    }
  })
}

exports.getOrSign = function(opts){
  var commonName = opts.commonName;
  var dir = path.resolve(opts.output, PREFIX + 'CN-' + commonName);
  var serverKey = path.resolve(dir, 'server.key');
  var serverCsr = path.resolve(dir, 'server.csr');
  var serverCrt = path.resolve(dir, 'server.crt');
  var callback = opts.end;
  var days = opts.days || DAYS;
  var bit = opts.bit || BIT;
  var CA = opts.CA;
  var caKey = CA.key;
  var caCrt = CA.cert;
  
  //不让demoCA产生更多的文件。
  const clearDemoCAIndex = cb => fs.writeFile(`${__dirname}/demoCA/index.txt`,'', cb);
  const clearDemoCASerial = cb => fs.writeFile(`${__dirname}/demoCA/serial`,'01', cb);

  const createServerKey = cb => exec(`openssl genrsa -out ${serverKey} ${bit}`, cb);

  const createServerCsr = cb => exec(
    `openssl req -sha256 -new -key ${serverKey} -out ${serverCsr} -subj "/C=CN/ST=ST/L=L/O=O/OU=OU/CN=${commonName}"`, 
    cb);

  const createServerCrt = cb => {
    var ls = exec(
    `openssl ca -in ${serverCsr}  -days ${days} -out ${serverCrt} -cert ${caCrt} -keyfile ${caKey}`,
    {cwd: __dirname},
    cb);
    ls.stdin.write('y\n');
    ls.stdin.write('y\n');
  }

  sas([
    initIfNotHave(dir),
    {
      cert: [createServerKey, createServerCsr],
      clearDemoCAIndex,
      clearDemoCASerial
    },
    createServerCrt
  ], function(err){
    if(err){
      removeDirOnError(err, dir, callback);
    }else{
      sas({
        $key: cb => fs.readFile(serverKey, cb),
        $cert: cb => fs.readFile(serverCrt, cb),
      }, callback);
    }
  })
}