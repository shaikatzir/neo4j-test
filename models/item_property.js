// item_property.js
// item property model logic.

var dbconn = require('../routes/dbconn');
var neo4j = dbconn.neo4j;
var db = dbconn.db;
var dbApi = require('./DBApi');

// constants:

var INDEX_NAME = 'node_auto_index';
var INDEX_KEY = 'type';
var INDEX_VAL = 'item_property';

var PROPERTIES_CAT = "item_property_cat";


// private constructor:

var ItemProperty = module.exports = function ItemProperty(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(ItemProperty.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(ItemProperty.prototype, 'exists', {
    get: function () { return this._node.exists; }
});

Object.defineProperty(ItemProperty.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

// private instance methods:

// public instance methods:

ItemProperty.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

ItemProperty.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};

// static methods:


ItemProperty.get = function (id, callback) {
	dbApi.getObj('./item_property',id,callback);
};

ItemProperty.getAll = function (callback) {
	dbApi.getAllObj('./item_property',INDEX_NAME, INDEX_KEY, INDEX_VAL,callback);
};

// creates the item_property and persists (saves) it to the db
ItemProperty.create = function (data, callback) {
        data.type = 'item_property';
	dbApi.create('./item_property',data,callback);
};

ItemProperty.getByName = function (name, callback) {
	dbApi.getObjByIndex('./item_property',INDEX_NAME, 'name', name,callback);
};

ItemProperty.getAllProperties = function (callback) {
   // query all properties and their categories:
    var query = [
    	'start n=node:node_auto_index(type="PROPERTIES_CAT")',
    	'match (n)-[:CAT]-(pr)',
		'with collect (distinct pr.name) as properties, pr.category as cat',
		'return properties, cat'
    ].join('\n')
        .replace('PROPERTIES_CAT',PROPERTIES_CAT)
 
    

    var item = this;
    db.query(query, {}, function (err, results) {
        if (err) return callback(err);
        callback(null, results);
    });
};


