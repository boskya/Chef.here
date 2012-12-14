/**
*  Get Chefs
* 
*/

module.exports = function (app, chefModel){

    // TODO: ensure that app and chefModel or throw error

	var findByCity = function (req, res) {

		var writeChef = function(err, chefs)
	    {
    		res.send(chefs);	
    	}

		chefModel.findChefsInCity(req.params.city, writeChef);
	}

	app.get('/chefs', findByCity);
	app.get('/chefs/:city', findByCity);

};


