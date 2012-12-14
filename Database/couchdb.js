// module to push out the DB views to couch db server

var couchapp = require('couchapp')
    , path = require('path');

  ddoc = {
      _id: '_design/Chef'
    , views: {}
    , lists: {}
    , shows: {} 
  }

  module.exports = ddoc;

  ddoc.views.byChef = {
    map: function(doc) {
      if ((doc.type) && (doc.type == "chef")){
        emit(doc._id, doc); 
      }
    
      if ((doc.type) && (doc.type == "restaurant")) 
      {
         for (var i in doc.chefs)
         {
            emit(doc.chefs[i], doc);
          }
      }
    },
  }

  ddoc.views.byCity = {
    map: function(doc) {
      if ((doc.type) && (doc.type == "chef")){
        emit(doc.home_city, doc._id); 
      }
    }
  }
