var vDiff = {};
module['exports'] = vDiff;

var through = require('through2');
var crypto = require('crypto');
var path = require('path');

vDiff.changed = function (stream, opts) {

  opts = opts || {
    compare: "sha",
  };

  opts.cwd = opts.cwd || process.cwd();
  
  var _newFiles = {};
  var _oldFiles = {};
  var _stream;

  stream.on('data', function(file){
    var newPath = path.resolve(opts.cwd, opts.dest, file.relative);
    _oldFiles[newPath] = file;
  });

  stream.on('end', function(){
    _stream.resume();
  });

  _stream = through.obj(function (file, enc, cb) {
    if (file.isDirectory()){
      return cb();
    }
    var _path = path.resolve(opts.cwd, opts.dest, file.relative);
    _newFiles[_path] = file;
    cb();
  }, function(cb){

    for (var file in _newFiles) {
      if (typeof _oldFiles[file] === "object" && _oldFiles[file].contents) {
        if (opts.compare === "sha") {
          if (compareSha(_newFiles[file], _oldFiles[file])) {
            this.push(_newFiles[file]);
          }
        } else {
          if (compareModifiedTime(_newFiles[file], _oldFiles[file])) {
            this.push(_newFiles[file])
          }
        }
      } else {
        this.push(_newFiles[file]);
      }
    }
    cb();
  });
  _stream.pause();
  return _stream;

};

function compareModifiedTime (oldFile, newFile) {
  var oldMtime = oldFile.stat.mtime.getTime();
  var newMtime = newFile.stat.mtime.getTime();
  return oldMtime > newMtime;
};

function compareSha (oldFile, newFile) {
  var oldSha = sha1(oldFile.contents.toString());
  var newSha = sha1(newFile.contents.toString());
  return oldSha !== newSha;
};

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}