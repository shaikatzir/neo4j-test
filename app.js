
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
    title: 'Node-Neo4j Test'    // default title
});

// Routes

app.get('/', routes.site.index);

//users
app.get('/users', routes.users.list);
app.post('/users', routes.users.create);
app.get('/users/:id', routes.users.show);
app.post('/users/:id', routes.users.edit);
app.del('/users/:id', routes.users.del);

app.post('/users/:id/follow', routes.users.follow);
app.post('/users/:id/unfollow', routes.users.unfollow);

app.post('/users/:id/additem', routes.users.additem);
app.post('/users/:id/rmitem', routes.users.rmitem);

//items
app.get('/items', routes.items.list);
app.post('/items', routes.items.filter);
app.get('/items/:id', routes.items.show);
app.post('/items/:id', routes.items.edit);
app.del('/items/:id', routes.items.del);

app.post('/items/:id/addproperty', routes.items.addproperty);
app.post('/items/:id/rmproperty', routes.items.rmproperty);

//item properties
app.get('/item_properties', routes.item_properties.list);
app.post('/item_properties', routes.item_properties.create);
app.get('/item_properties/:id', routes.item_properties.show);
app.post('/item_properties/:id', routes.item_properties.edit);
app.del('/item_properties/:id', routes.item_properties.del);


//search
app.get('/donde',routes.donde.donde);
app.post('/donde',routes.donde.searchkey);

require('./router').init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
