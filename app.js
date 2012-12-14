
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('db_url','http://localhost:5984/');
  app.set('db_name','chef_here');
});

app.get('/', routes.index);
app.get('/users', user.list);

var chefStore = require('./nanoaccess')(app);
var chefModel = require('./models/chefs');

/**
 Chef_here routes
*/

var chefRoutes = require('./routes/chefs')(app, new chefModel(chefStore));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
