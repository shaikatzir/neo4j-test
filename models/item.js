// item.js
// User model logic.

var dbconn = require('../routes/dbconn');
var neo4j = dbconn.neo4j;
var db = dbconn.db;
var dbApi = require('./DBApi');

var Property = require('./item_property');
// constants:

var INDEX_NAME = 'node_auto_index';
var INDEX_KEY = 'type';
var INDEX_VAL = 'item';
var INDEX_PROPERTY_VAL = 'item_property';

var PROPERTY_REL = 'PROPERTY'; //for now we give every one the same rel

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
Item.prototype._getPropertyRel = function (other, callback) {
    var query = [
        'START user=node({itemId}), other=node({otherId})',
        'MATCH (user) -[rel]-> (other)',
        'RETURN rel'
    ].join('\n')

    var params = {
        itemId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var rel = results[0] && results[0]['rel'];
        callback(null, rel);
    });
};

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

Item.prototype.addProperty = function (other, callback) {
    this._node.createRelationshipTo(other._node, PROPERTY_REL, {}, function (err, rel) {
        callback(err);
    });
};

Item.prototype.rmProperty = function (other, callback) {
    this._getPropertyRel(other, function (err, rel) {
        if (err) return callback(err);
        if (!rel) return callback(null);
        rel.del(function (err) {
            callback(err);
        });
    });
};

Item.prototype.getItemProperties = function (callback) {
   // query all items and whether have connection or not:
    var query = [
        'START item=node({itemId}), other=node:INDEX_NAME(INDEX_KEY="INDEX_PROPERTY_VAL")',
        'MATCH (item) -[rel?]-> (other)',
        'RETURN other, COUNT(rel) ',  // COUNT(rel) is a hack for 1 or 0
        'ORDER BY other.name'
    ].join('\n')
        .replace('INDEX_NAME', INDEX_NAME)
        .replace('INDEX_KEY', INDEX_KEY)
        .replace('INDEX_PROPERTY_VAL', INDEX_PROPERTY_VAL)
 
    var params = {
        itemId: this.id,
    };

    var item = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var properties = [];
        var others = [];
        for (var i = 0; i < results.length; i++) {
            var other = new Property(results[i]['other']);
            var isProperty = results[i]['COUNT(rel)'];

	    if (isProperty) {
                properties.push(other);
            } else {
                others.push(other);
            }
       } 
       callback(null, properties, others);
    });
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
