// item_properties.js
// Routes to CRUD item_properties.

var property = require('../models/item_property');

/**
 * GET /item_properites
 */
exports.list = function (req, res, next) {
    property.getAll(function (err, properties) {
        if (err) return next(err);
        res.render('item_properties', {
            item_properties: properties
        });
    });
};

/**
 * POST /item_properites
 */
exports.create = function (req, res, next) {
    property.create({
        name: req.body['name']
    }, function (err, Property) {
        if (err) return next(err);
        res.redirect('/item_properites/' + Property.id);
     });
};

/**
 * GET /item_properites/:id
 */
exports.show = function (req, res, next) {
    property.get(req.params.id, function (err, property) {
        if (err) return next(err);
        res.render('item_property', {
		property : property	
	});       
    });
};

/**
 * POST /item_properites/:id
 */
exports.edit = function (req, res, next) {
    property.get(req.params.id, function (err, property) {
        if (err) {
		console.log("got err " + err);
		return next(err);}
        property.name = req.body['name'];
        property.save(function (err) {
            if (err) return next(err);
            res.redirect('/item_properties/' + property.id);
        });
    });
};

/**
 * DELETE /item_properties/:id
 */
exports.del = function (req, res, next) {
    property.get(req.params.id, function (err, property) {
        if (err) return next(err);
        property.del(function (err) {
            if (err) return next(err);
            res.redirect('/item_properties');
        });
    });
};


