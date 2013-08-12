// items.js
// Routes to CRUD items.

var item = require('../models/item');
var Property = require('../models/item_property');

/**
 * GET /items
 */
exports.list = function (req, res, next) {
    item.getAll(function (err, items) {
        if (err) return next(err);
        res.render('items', {
            items: items
        });
    });
};

/**
 * POST /items
 */
exports.create = function (req, res, next) {
    item.create({
        name: req.body['name']
    }, function (err, item) {
        if (err) return next(err);
        res.redirect('/items/' + item.id);
    });
};

/**
 * GET /items/:id
 */
exports.show = function (req, res, next) {
    item.get(req.params.id, function (err, item) {
        if (err) return next(err);
	item.getItemProperties(function (err, properties, other_prs) {
            if (err) return next(err);
            res.render('item', {
                item: item,
                properties: properties,
                other_prs : other_prs
            });
        });
    });
};

/**
 * POST /items/:id
 */
exports.edit = function (req, res, next) {
    item.get(req.params.id, function (err, item) {
        if (err) return next(err);
        item.name = req.body['name'];
        item.save(function (err) {
            if (err) return next(err);
            res.redirect('/items/' + item.id);
        });
    });
};

/**
 * DELETE /items/:id
 */
exports.del = function (req, res, next) {
    item.get(req.params.id, function (err, item) {
        if (err) return next(err);
        item.del(function (err) {
            if (err) return next(err);
            res.redirect('/items');
        });
    });
};

/**
 * POST /items/:id/addproperty
 */
//req : req.params.id : current item
//	req.body.property.id : property id to be added
exports.addproperty = function (req, res, next) {
    item.get(req.params.id, function (err, item) {
        if (err) return next(err);
        Property.get(req.body.property.id, function (err, other) {
            if (err) return next(err);
            item.addProperty(other, function (err) {
                if (err) return next(err);
                res.redirect('/items/' + item.id);
            });
        });
    });
};


/**
 * POST /items/:id/rmproperty
 */
//req : req.params.id : current item
//	req.body.property.id : property id to be added
exports.rmproperty = function (req, res, next) {
    item.get(req.params.id, function (err, item) {
        if (err) return next(err);
        Property.get(req.body.property.id, function (err, other) {
            if (err) return next(err);
            item.rmProperty(other, function (err) {
                if (err) return next(err);
                res.redirect('/items/' + item.id);
            });
        });
    });
};

