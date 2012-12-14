
module.exports = function Database(app)
{
	var nano = require('nano')(app.get('db_url'));
	var chef_here  = nano.db.use(app.get('db_name'));
	return chef_here;
}