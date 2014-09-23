var changed = require('../index').changed;
var vfs = require('vinyl-fs');
var through = require('through2');
var touch = require("touch");
var tap = require("tap");

tap.test('can call vdiff.changed', function (t) {

  vfs.src('./test/fixtures/new-files/**')
    .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "sha", dest: "old-files"}))
    .pipe(through.obj(function(file, enc, cb){
      cb(null, file);
    }, function(cb){
      t.end();
    }))
});

tap.test('vdiff.changed - can detect changed files by sha', function (t) {

  var changes = {};
  vfs.src('./test/fixtures/new-files/**')
    .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "sha", dest: "old-files"}))
    .pipe(through.obj(function(file, enc, cb){
      changes[file.relative] = file;
      cb(null, file);
    }, function(cb){
      // compare changes
      t.equal(Object.keys(changes).length, 2)
      t.type(changes['a.js'], "object")
      t.type(changes['b.js'], "undefined")
      t.type(changes['c.js'], "object")
      t.end();
    }))

});

tap.test('vdiff.changed - can detect changed files by mtime', function (t) {

  // touch files to ensure correct mtimes
  touch.sync('./test/fixtures/new-files/a.js');
  touch.sync('./test/fixtures/old-files/b.js');
  touch.sync('./test/fixtures/new-files/c.js');

  var changes = {};
  vfs.src('./test/fixtures/new-files/**')
    .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "mtime", dest: "old-files"}))
    .pipe(through.obj(function(file, enc, cb){
      changes[file.relative] = file;
      cb(null, file);
    }, function(cb){
      t.equal(Object.keys(changes).length, 2)
      t.type(changes['a.js'], "object")
      t.type(changes['c.js'], "object")
      t.end();
    }));

});