  var service = require("os-service");
var path = require('path');
  service.remove ("OSserviceTest", function(error) { 
        if (error) {
            console.trace(error);
        }
		console.log('service removed successfully')
		
    });