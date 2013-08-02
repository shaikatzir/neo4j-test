// users.js
// Routes to CRUD users.

var User = require('../models/user');

/**
 * GET /users
 */
exports.list = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.render('users', {
            users: users
        });
    });
};

/**
 * POST /users
 */
exports.create = function (req, res, next) {
    User.create({
        name: req.body['name']
    }, function (err, user) {
        if (err) return next(err);
        res.redirect('/users/' + user.id);
    });
};

/**
 * GET /users/:id
 */
exports.show = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.getUserSN(function (err, friends, others, items, other_items) {
            if (err) return next(err);
            res.render('user', {
                user: user,
                following: friends,
                others: others,
		items : items,
		other_items : other_items
            });
        });
    });
};

/**
 * POST /users/:id
 */
exports.edit = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.name = req.body['name'];
        user.save(function (err) {
            if (err) return next(err);
            res.redirect('/users/' + user.id);
        });
    });
};

/**
 * DELETE /users/:id
 */
exports.del = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users');
        });
    });
};

/**
 * POST /users/:id/follow
 */
exports.follow = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        User.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};

/**
 * POST /users/:id/unfollow
 */
exports.unfollow = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        User.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};

/**
 * POST /users/:id/additem
 */
//req : req.params.id : item id to be added
//	req.body.user.id : current user
exports.additem = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        Item.get(req.body.item.id, function (err, other) {
            if (err) return next(err);
            user.addItem(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};

/**
 * POST /users/:id/rmitem
 */
exports.rmitem = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        User.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};
