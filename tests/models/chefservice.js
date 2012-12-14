//
// Tests for Chef Model Service layer
// 

var assert = require("assert");
var chefModelService = require('../../Models/Chefs')
var sinon = require("sinon");
var should = require("should");


describe('Chef', function(){
	describe('#findChefsByCity()', function(){

		
		it('should return error when the byCity view returns an error', function(done){
			var chefAccess = null;
					// stub out the chefAccess			
			var chefAccess = {  view: function(design, viewname, params, callback) { } };
			var stub = sinon.stub(chefAccess, "view");
			stub.withArgs('Chef','byCity', sinon.match.any, sinon.match.func).callsArgWith(3, {"error":"bad_request","reason":"invalid_json"}, null);

			var chefModel = new chefModelService(chefAccess);
			var verifyResult = function (err, chefs){
				err.should.have.property("error","bad_request");
				should.not.exist(chefs);
				done();
			}

			chefModel.findChefsInCity("seattle",verifyResult);

		});
		
		it('should return error when the byChef view returns an error', function(done){

				// Data Returned by the databse
			var dbChef = {
							"total_rows":2,
							"offset":1,
							"rows":[
								{"id":"abefef9a5ccda2593b411a63040078b8","key":"seattle","value":"abefef9a5ccda2593b411a63040078b8"}
							]
						};

			// stub out the chefAccess			
			var chefAccess = {  view: function(design, viewname, params, callback) { } };
			var stub = sinon.stub(chefAccess, "view");
			stub.withArgs('Chef','byCity', sinon.match.any, sinon.match.func).callsArgWith(3, null, dbChef);
			stub.withArgs('Chef','byChef', sinon.match.any, sinon.match.func).callsArgWith(3, {"error":"bad_request2","reason":"invalid_json"});

			var chefModel = new chefModelService(chefAccess);
			var verifyResult = function (err, chefs){
				err.should.have.property("error","bad_request2");
				should.not.exist(chefs);
				done();
			}

			chefModel.findChefsInCity("seattle",verifyResult);

		});

		it('should return empty body when no chefs found for a city', function(done){

				// Data Returned by the databse
			var dbChef = {
							"total_rows":2,
							"offset":1,
							"rows":[]							
						};

			// stub out the chefAccess			
			var chefAccess = {  view: function(design, viewname, params, callback) { } };
			var stub = sinon.stub(chefAccess, "view");
			stub.withArgs('Chef','byCity', sinon.match.any, sinon.match.func).callsArgWith(3, null, dbChef);

			var chefModel = new chefModelService(chefAccess);
			var verifyResult = function (err, chefs){
				should.not.exist(err);
				should.exist(chefs);
				chefs.should.have.lengthOf(0);
				done();
			}

			chefModel.findChefsInCity("seattle",verifyResult);

		});

		it('should return a list of chefs and their restaurants filtered to seattle', function(done){
			
			// Data Returned by the databse
			var dbChef = {
							"total_rows":2,
							"offset":1,
							"rows":[
								{"id":"abefef9a5ccda2593b411a63040078b8","key":"seattle","value":"abefef9a5ccda2593b411a63040078b8"}
							]
						};

						  
			var dbChefRestaurants = {
					"total_rows":5,
					"offset":0,
					"rows":[
						{"id":"abefef9a5ccda2593b411a63040078b8","key":"abefef9a5ccda2593b411a63040078b8","value":{"_id":"abefef9a5ccda2593b411a63040078b8","_rev":"1-1840955045f4dd0970f9ce1880cc6704","name":"Maria Hines","type":"chef","home_city":"seattle","twitter":"mariahines","blog":""}},
						{"id":"abefef9a5ccda2593b411a6304007fbf","key":"abefef9a5ccda2593b411a63040078b8","value":{"_id":"abefef9a5ccda2593b411a6304007fbf","_rev":"2-3785f1593b6242fcec8b62b3d436151e","type":"restaurant","name":"Tilth","yelp_rating":3.5,"urbanspoon_rating":4,"Address":{"street":"N 45th St","street_number":"1411","city":"Seattle","state":"WA","zip":"98103"},"phone":"2066330801","chefs":["abefef9a5ccda2593b411a63040078b8"]}},
						{"id":"abefef9a5ccda2593b411a63040080eb","key":"abefef9a5ccda2593b411a63040078b8","value":{"_id":"abefef9a5ccda2593b411a63040080eb","_rev":"2-236db4221751817f4f0e752914674fac","type":"restaurant","name":"Golden Beetle","yelp_rating":3.5,"urbanspoon_rating":4,"Address":{"street":"NW Market St","street_number":"1744","city":"Seattle","state":"WA","zip":"98107"},"phone":"2067062977","chefs":["abefef9a5ccda2593b411a63040078b8"]}}
					]
				};
			


			// stub out the chefAccess			
			var chefAccess = {  view: function(design, viewname, params, callback) { } };
			var stub = sinon.stub(chefAccess, "view");
			stub.withArgs('Chef','byCity', sinon.match.any, sinon.match.func).callsArgWith(3, null, dbChef);
			stub.withArgs('Chef','byChef', sinon.match.any, sinon.match.func).callsArgWith(3, null, dbChefRestaurants);


			var chefModel = new chefModelService(chefAccess);

			var verifyResult = function (err, chefs){
				chefs.should.have.lengthOf(1);
				chefs[0].should.have.property('name', 'Maria Hines');
				chefs[0].should.have.property('restaurants').with.lengthOf(2);
				chefs[0].restaurants[0].should.have.property('name','Tilth');
				chefs[0].restaurants[1].should.have.property('name', 'Golden Beetle');
				done();
			}

			chefModel.findChefsInCity("seattle",verifyResult);

		});
	})
})