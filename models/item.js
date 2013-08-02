// item.js
// User model logic.

var dbconn = require('../routes/dbconn');
var neo4j = dbconn.neo4j;
var db = dbconn.sb;
var dbApi = require('./DBApi');

// constants:

var INDEX_NAME = 'node_auto_index';
var INDEX_KEY = 'type';
var INDEX_VAL = 'item';


// private constructor:

var Item = module.exports = function Item(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Item.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Item.prototype, 'exists', {
    get: function () { return this._node.exists; }
});

Object.defineProperty(Item.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

// private instance methods:

// public instance methods:

Item.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Item.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};


// static methods:


Item.get = function (id, callback) {
	dbApi.getObj('./item',id,callback);
};

Item.getAll = function (callback) {
	dbApi.getAllObj('./item',INDEX_NAME, INDEX_KEY, INDEX_VAL,callback);
};

// creates the Item and persists (saves) it to the db
Item.create = function (data, callback) {
        data.type = 'item';
	dbApi.create('./item',data,callback);
};
