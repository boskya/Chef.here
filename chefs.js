/**
*  Get Chefs
* 
*/

exports.chefs = function(req, res)
{
  //connect to nano and respond with list of chefs
  nano.db.use('chef_here');
};