// items.js
// Routes to CRUD items.

var item = require('../models/item');

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
        res.render('item', {
		item : item	
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


