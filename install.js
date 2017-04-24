var service = require("os-service");
var path = require('path');
 service.add("OSserviceTest", {programPath: path.join(__dirname, 'bin/www'),
 function(error) { 
            if (error) {
                console.trace(error);
            } 
			console.log('created successfully')
 }
 });
