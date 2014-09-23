# vinyl-diff

## Unreleased v0.0.0

## Information

<table>
<tr>
<td>Package</td><td>vinyl-diff</td>
</tr>
<tr>
<td>Description</td>
<td>Perform diffs of vinyl streams</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Purpose

This library allows you to perform diffs between streams of vinyl.

This enables the ability to only push vinyl files that have changed down the stream.

All vinyl-adapters are compatible with this module.

Alternatives to using this module could be `gulp-changed`, but `gulp-changed` is bound to the file-system and unable to compare arbitrary vinyl streams.

## Usage


### Only use changed files

```javascript
var changed = require('../index').changed;
var vfs = require('vinyl-fs');
var map = require('map-stream');

var log = function (file, cb){
  console.log(file)
  cb(null, file);
};

vfs.src('./test/fixtures/new-files/**')
 .pipe(map(log))
 .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "sha", dest: "old-files"}))
 .pipe(map(log));

```

### Only use files with newer mtime

```javascript
var changed = require('../index').changed;
var vfs = require('vinyl-fs');
var map = require('map-stream');

var log = function (file, cb){
  console.log(file)
  cb(null, file);
};

vfs.src('./test/fixtures/new-files/**')
 .pipe(map(log))
 .pipe(changed(vfs.src('./test/fixtures/old-files/**'), { compare: "mtime", dest: "old-files"}))
 .pipe(map(log));
```


## API

### changed(stream, [,opt])

- Takes a vinyl stream as the first argument.
- Possible options for the second argument:
 - compare - property to compare for changes. Default is `sha`. Also available: `mtime`
 - dest - destination to compare new files against
- Returns a Readable/Writable stream.
- This stream emits matching [vinyl] File objects