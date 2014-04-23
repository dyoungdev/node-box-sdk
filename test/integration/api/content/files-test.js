'use strict';

var assert = require("assert"),
  utils = require('../../../helpers/utils'),
  box_sdk = require('../../../..');

describe('Connection', function () {
  describe('Files', function () {
    var PORT = parseInt(process.env.ICT_PORT, 10) + 3,
      opts = {
        client_id: process.env.ICT_CLIENT_ID,
        client_secret: process.env.ICT_CLIENT_SECRET,
        port: PORT,
        'log-level': 'debug'
      },
      box, connection, test_nbsdk_id;

    before(function (done) {
      box = box_sdk.Box(opts);
      connection = box.getConnection(process.env.ICT_EMAIL_ID);

      utils.prepTestFolder(connection, function (err, tid) {
        if (err) {
          return done(err);
        }
        test_nbsdk_id = tid;
        done();
      });
    });

    it('should return a file\'s info', function (done) {
      utils.prepSampleFile(function (err, dest) {
        if (err) {
          return done(err);
        }
        connection.uploadFile(dest, test_nbsdk_id, null, function (err, result) {
          assert.ifError(err);
          var fid = result.entries[0].id;
          connection.getFileInfo(fid, function (err, result) {
            assert.ifError(err);
            assert.equal(result.id, fid);
            assert.equal(result.type, 'file');

            done();
          });
        });
      });
    });

    it('should download a file', function (done) {
      utils.prepSampleFile(function (err, dest) {
        if (err) {
          return done(err);
        }
        connection.uploadFile(dest, test_nbsdk_id, null, function (err, result) {
          assert.ifError(err);
          connection.getFile(result.entries[0].id, null, function (err, result) {
            assert.ifError(err);
            assert(result);

            done();
          });
        });
      });
    });

    it('should create a file', function (done) {
      utils.prepSampleFile(function (err, dest) {
        if (err) {
          return done(err);
        }
        connection.uploadFile(dest, test_nbsdk_id, null, function (err, result) {
          assert.ifError(err);
          assert(result.entries instanceof Array);
          assert.notEqual(result.entries.length, 0);
          assert.equal(result.entries[0].type, 'file');

          done();
        });
      });
    });

    it('should update a file', function (done) {
      var fields = {
        description: utils.uuid()
      };

      utils.prepSampleFile(function (err, dest) {
        if (err) {
          return done(err);
        }
        connection.uploadFile(dest, test_nbsdk_id, null, function (err, result) {
          assert.ifError(err);
          connection.updateFile(result.entries[0].id, fields, function (err, result) {
            assert.ifError(err);
            assert.equal(result.type, 'file');
            assert.equal(result.description, fields.description);

            done();
          });
        });
      });
    });

    after(function (done) {
      if (test_nbsdk_id) {
        connection.deleteFolder(test_nbsdk_id, {
          recursive: true
        }, function (err, result) {
          if (err) {
            console.error(err);
          }
        });
      }
      box.stopServer(done);
    });
  });
});