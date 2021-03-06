// DBApi.js
// exports DB simple API

var dbconn = require('../routes/dbconn');
var neo4j = dbconn.neo4j;
var db = dbconn.db;


exports.getObj = function (type, id, callback) {
    var objType = require(type);
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new objType(node));
    });
};

exports.getAllObj = function (type, in_name, in_key, in_val, callback) {
    var objType = require(type);
    db.getIndexedNodes(in_name, in_key, in_val, function (err, nodes) {
        // if (err) return callback(err);
        // XXX FIXME the index might not exist in the beginning, so special-case
        // this error detection. warning: this is super brittle!!
        if (err) return callback(null, []);
		var objs = nodes.map(function (node) {
            return new objType(node);
        });
        callback(null, objs);
    });
};

// creates the object and persists (saves) it to the db:
exports.create = function (type, data, callback) {
    var objType = require(type);
    var node = db.createNode(data);
    var obj = new objType(node);
    node.save(function (err) {
        if (err) return callback(err);
		console.log('Node saved to database with id:', node.id);
		callback(null,obj);
//        node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err) {
//            if (err) return callback(err);
//            callback(null, user);
//        });
    });
};

exports.getObjByIndex = function (type, in_name, in_key, in_val, callback) {
    var objType = require(type);
    db.getIndexedNode(in_name, in_key, in_val, function (err, node) {
        if (err) return callback(err);
        if (node)
	        callback(null, new objType(node));
	    else
	    	callback(null);
    });
};

