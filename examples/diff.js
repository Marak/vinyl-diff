var changed = require('../index').changed;
var vfs = require('vinyl-fs');
var map = require('map-stream');

var log = function (file, cb){
  console.log(file.path)
  cb(null, file);
};


/*
var vhttp = require('vinyl-http');
vhttp.src('http://localhost:8888/test/fixtures/**')
  //.pipe(map(log))
  .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "sha", dest: "old-files"}))
  .pipe(map(log))

*/
vfs.src('./test/fixtures/new-files/**')
  .pipe(map(log))
  .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "sha", dest: "old-files"}))
  .pipe(map(log))

vfs.src('./test/fixtures/new-files/**')
  .pipe(map(log))
  .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "mtime", dest: "old-files"}))
  .pipe(map(log));