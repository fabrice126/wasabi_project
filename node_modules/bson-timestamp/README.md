# bson-timestamp

[![NPM version](https://badge.fury.io/js/bson-timestamp.png)](http://badge.fury.io/js/bson-timestamp)

This mdoule allows you to create and parse BSON `Timestamp`s without a reference to the
[mongodb](https://github.com/mongodb/node-mongodb-native) or [bson](https://github.com/mongodb/js-bson)
modules.

It is just a mirrow of the [timestamp.js](https://github.com/mongodb/js-bson/blob/master/lib/bson/timestamp.js) file in [bson](https://github.com/mongodb/js-bson)

### Motivation

I created this for my [mongo-oplog-cursor](https://github.com/cayasso/mongo-oplog-cursor) project, where I just needed to use the `Timestamp` class for a tiny conversion, so please use at your own risk :-)

### Instalation

```bash
$ npm install bson-timestamp
```

### Usage

Check the [official use guide](http://docs.mongodb.org/master/reference/bson-types/#timestamps)

### Build

``` bash
$ make build
```

### License

Apache v2.0

See LICENSE file.
