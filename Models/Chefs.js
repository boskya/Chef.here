//
// Model that describes Chef and their restaurants
//

var Chefs = function(chefStore) {


	this.findChefsInCity = function(city, callback) {

		// first need to get all Ids and then we need to get all restaurants related to those chefs
		chefStore.view('Chef','byCity', {'keys': [city]}, function (err, body){
			if (!err) {
				if (body.rows){
					// send the list of keys and get restaurant data
					var rows = body.rows;

					var keys = [];	
					for(var i=0; i< rows.length; i++)
					{
						keys[i] = rows[i].value;
					}

					if (keys.length > 0){
						chefStore.view('Chef', 'byChef', { 'keys' : keys}, function (err, chefCompleteData) {
							if (!err) {
									// we have the chefComplete Data, now we need to denormalize this
									// and combine the restaurant docs into chef docs
									callback(null, mergeChefData(chefCompleteData));
									
							}
							else
							{
								callback(err);
							}
							
						}); 
					}
					else
					{
						callback(null, []);
					}
				}
			}
			else
			{
				callback(err)
			}
		});
	}

	var mergeChefData = function(chefCompleteData) {
		var chefs = [];
			
			var index = -1;						
			for (var chefRowIndex in chefCompleteData.rows)
			{
				var chefRow = chefCompleteData.rows[chefRowIndex];

				if (chefRow.value.type == "chef")
				{
					index++;
					chefs[index] = { "id": chefRow.key, "restaurants"	: [], "name" : chefRow.value.name };	
				}
				else if (chefRow.value.type == "restaurant")
				{
					if (!chefs[index].restaurants)
					{
						chefs[index].restaurants = new Array();
					}
					chefs[index].restaurants.push(chefRow.value);
				}
			}
		return chefs;								
	}

}

module.exports = Chefs;
