/*
//***************************************
Written by Stephen Lippens
slippens@microstrategy.com
10/01/2018
https://github.com/slippens
//***************************************
*/
var https = require('https');
var config = require("./config.json");
var _authToken= null;
var _cookie= null;
var robustLogging = true;
//**********************************************************************


//Add data every x seconds
setInterval(() => {
	generateDataForCube(config.nameOfCubeToCreateOrUpdate);
}, 5000);

function generateDataForCube(cubeName) {
    //get token from system - either resuse existing or get new if expired    
    getValidToken(function (error){
        if(error){
            console.log("Execution terminated -> error getting session: " + error);
            return;
        }
       
       //console.log("authToken: " + _authToken);
        searchForMyReportsFolder(function(err, myReportsFolderID){
			//console.log("my reports folderID: " + myReportsFolderID);


			//check if cube exists in my reports
			searchForCube(myReportsFolderID, cubeName, function(err, cubeID){
				if(err){
					console.log("ERROR: " + err);
					return;
				}

				//Generate random data for sample - data must be encoded base64
				var base64EncodedData = getGeneratedData();
				
				//define table structure
				var createTableStructure = "{\"name\":\""+cubeName+"\",\"tables\":[{\"data\":\""+base64EncodedData+"\",\"name\":\"Table\",\"columnHeaders\":[{\"name\":\"timestamp\",\"dataType\":\"DOUBLE\"},{\"name\":\"callcenter\",\"dataType\":\"STRING\"},{\"name\":\"employee\",\"dataType\":\"STRING\"},{\"name\":\"oncall\",\"dataType\":\"DOUBLE\"},{\"name\":\"profit\",\"dataType\":\"DOUBLE\"}]}],\"metrics\":[{\"name\":\"oncall\",\"dataType\":\"number\",\"expressions\":[{\"formula\":\"Table.oncall\"}]},{\"name\":\"profit\",\"dataType\":\"number\",\"expressions\":[{\"formula\":\"Table.profit\"}]}],\"attributes\":[{\"name\":\"timestamp\",\"attributeForms\":[{\"category\":\"ID\",\"expressions\":[{\"formula\":\"Table.timestamp\"}],\"dataType\":\"double\"}]},{\"name\":\"callcenter\",\"attributeForms\":[{\"category\":\"ID\",\"expressions\":[{\"formula\":\"Table.callcenter\"}],\"dataType\":\"STRING\"}]},{\"name\":\"employee\",\"attributeForms\":[{\"category\":\"ID\",\"expressions\":[{\"formula\":\"Table.employee\"}],\"dataType\":\"STRING\"}]}]}";

				//var createTableStructure = "{\"name\":\""+cubeName+"\",\"tables\":[{\"data\":\""+base64EncodedData+"\",\"name\":\"Table\",\"columnHeaders\":[{\"name\":\"timestamp\",\"dataType\":\"DOUBLE\"},{\"name\":\"callcenter\",\"dataType\":\"STRING\"},{\"name\":\"employee\",\"dataType\":\"STRING\"},{\"name\":\"profit\",\"dataType\":\"DOUBLE\"}]}],\"metrics\":[{\"name\":\"profit\",\"dataType\":\"number\",\"expressions\":[{\"formula\":\"Table.profit\"}]},{\"name\":\"oncall\",\"dataType\":\"number\",\"expressions\":[{\"formula\":\"Table.oncall\"}]}],\"attributes\":[{\"name\":\"timestamp\",\"attributeForms\":[{\"category\":\"ID\",\"expressions\":[{\"formula\":\"Table.timestamp\"}],\"dataType\":\"double\"}]},{\"name\":\"callcenter\",\"attributeForms\":[{\"category\":\"ID\",\"expressions\":[{\"formula\":\"Table.callcenter\"}],\"dataType\":\"STRING\"}]},{\"name\":\"employee\",\"attributeForms\":[{\"category\":\"ID\",\"expressions\":[{\"formula\":\"Table.employee\"}],\"dataType\":\"STRING\"}]}]}";
				var updateTableStructure = "{\"name\":\"Table\",\"columnHeaders\":[{\"name\":\"timestamp\",\"dataType\":\"DOUBLE\"},{\"name\":\"callcenter\",\"dataType\":\"STRING\"},{\"name\":\"employee\",\"dataType\":\"STRING\"},{\"name\":\"oncall\",\"dataType\":\"DOUBLE\"},{\"name\":\"profit\",\"dataType\":\"DOUBLE\"}],\"data\":\""+base64EncodedData+"\"}";


				if(cubeID == null){
					addDataToCube(createTableStructure, cubeID, function(){
						console.log("Cube has been initially created with data: " + cubeName);
					});
				}
				else{
					addDataToCube(updateTableStructure, cubeID, function(){
						console.log("added data to cube: " + cubeName);
					});
				}
			
			});

        });
       
    });
}



function getGeneratedData(){
	//Create row(s) of data for cube:
	var timestamp = Math.floor(new Date() / 1000);

	var id_val = Math.floor(Math.random() * 20000);
	var price_val = Math.floor(Math.random() * 20000);

	var data = [];

	//Call center 1
	for( var i = 0; i < 3; i++){
		var row = {};
		row.timestamp = timestamp; //same for all
		row.callcenter = "North"; //hardcoded
		row.employee = ["Stephen", "Tony", "HF"][i]; //members in order
		row.oncall = Math.floor((Math.random() * 1) + 1); //0 or 1
		row.profit = Math.floor(Math.random() * 500); // 0-500
		data.push(row);
	}

	//Call center 2
	for( var i = 0; i < 3; i++){
		var row = {};
		row.timestamp = timestamp; //same for all
		row.callcenter = "South"; //hardcoded
		row.employee = ["David", "Susan", "Carlos"][i]; //members in order
		row.oncall = Math.floor((Math.random() * 1) + 1); //0 or 1
		row.profit = Math.floor(Math.random() * 500); // 0-500
		data.push(row);
	}

	//Call center 3
	for( var i = 0; i < 3; i++){
		var row = {};
		row.timestamp = timestamp; //same for all
		row.callcenter = "East"; //hardcoded
		row.employee = ["Craig", "Scott", "Brandon"][i]; //members in order
		row.oncall = Math.round(Math.random()); //0 or 1
		row.profit = Math.floor(Math.random() * 500); // 0-500
		data.push(row);
	}


	//var JSONString = "[{\"ID\":"+id_val+",\"Price\":"+price_val+"}]";
	//var dataObject = JSON.parse(JSONString);
	//console.log(JSON.stringify(data));
	var base64EncodedData = Buffer.from(JSON.stringify(data)).toString('base64');


	return base64EncodedData;
}


function getValidToken(callback){
    //console.log("getValidToken");

    isAuthTokenAlive(function(existingTokenIsValid){
        if(existingTokenIsValid){
            //console.log("Token valid -> returning existing session");
            return callback(null);
        }
        else{
            //console.log("Token null or invalid -> need to get new session");
            getRestSession(function(error, token, cookie){

                //persist token and cookie
                _authToken = token;
                _cookie = cookie;
                return callback(error);
            });
        }
   });
}

//Calls UserInfo API to validate existing session, returns TRUE or FALSE
function isAuthTokenAlive(callback){
    if(_authToken == null){
        if(robustLogging) console.log("-------> " + "||REST|| AuthToken in memory is null -> Create Token");
        return callback(false);
    }
    else{
        //console.log("authToken is not null, must validate");
        //make API call to validate token
        var post_data = '';
        //console.log(post_data);

        // An object of options to indicate where to post to
        var post_options = {
          host: config.host,
          port: config.port,
          path: '/MicroStrategyLibrary/api/sessions/userInfo',
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-MSTR-AuthToken':_authToken,
              'cookie': _cookie[0]
          }
        };
        //console.log(post_options);
        var responseString = '';

        // Set up the request
        var post_req = https.request(post_options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              responseString += chunk;
          });
          res.on('end', function () {
            
            //console.log(res.statusCode);
            //console.log(responseString);
            
              if (res.statusCode == 200){
                  callback(true);
              }
              else{
                  //Not valid
                  callback(false);
              }
             
          });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    }
}

//Gets AuthToken based on config parameters stored in globals
function getRestSession(callback){

  var post_data = '{\"username\": \"'+config.username+'\",\"password\": \"'+config.password+'\"}';
  //console.log(post_data);

  // An object of options to indicate where to post to
  var post_options = {
      host: config.host,
      port: config.port,
      path: '/MicroStrategyLibrary/api/auth/login',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
  };
  //console.log(post_options);
  var responseString = '';
   
  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          responseString += chunk;
      });
      res.on('end', function () {
          
          if (res.statusCode == 204){
              //console.log(res.headers);
              var cookie = res.headers['set-cookie'];
              var token = res.headers['x-mstr-authtoken'];
              callback(null, token, cookie);
          }
          else{
              //ERROR
              callback("error", null, null);
          }
      });
  });
  // post the data
  post_req.write(post_data);
  post_req.end();
}

function searchForMyReportsFolder(callback) {

	// An object of options to indicate where to post to
	var post_options = {
	  host: config.host,
	  port: config.port,
	  path: '/MicroStrategyLibrary/api/folders/myPersonalObjects',
	  method: 'GET',
	  headers: {
	      'Content-Type': 'application/json',
	      'Accept': 'application/json',
	      'X-MSTR-AuthToken': _authToken,
	      'X-MSTR-ProjectID': config.projectID,
	      'cookie': _cookie[0]
	  }
	};
	//console.log(post_options);
	var responseString = '';

	// Set up the request
	var post_req = https.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			responseString += chunk;
		});
		res.on('end', function () {

			//console.log(res.statusCode);
			if (res.statusCode == 200){
				//console.log(res.headers);
				var responseObj = JSON.parse(responseString);

				for(var i = 0; i < responseObj.length;i++){
					var child = responseObj[i];

					//console.log("Evaluating: " + child.name);
					if(child.name == "My Reports"){
						//console.log("Found MyReports Folder: " + child.name);
						return callback(null, child.id);

					}
				}


				return callback('could not find my reports', null);
			}
			else{
				//ERROR
				callback("error", null);
			}
		});
	});
	
	post_req.end();
}

function searchForCube(myReportsFolderID, cubeName, callback) {
  
	// An object of options to indicate where to post to
	var post_options = {
	  host: config.host,
	  port: config.port,
	  path: '/MicroStrategyLibrary/api/folders/' + myReportsFolderID,
	  method: 'GET',
	  headers: {
	      'Content-Type': 'application/json',
	      'Accept': 'application/json',
	      'X-MSTR-AuthToken': _authToken,
	      'X-MSTR-ProjectID': config.projectID,
	      'cookie': _cookie[0]
	  }
	};
	//console.log(post_options);
	var responseString = '';

	// Set up the request
	var post_req = https.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			responseString += chunk;
		});
		res.on('end', function () {

			//console.log(res.statusCode);
			if (res.statusCode == 200){
				//console.log(res.headers);
				var responseObj = JSON.parse(responseString);

				for(var i = 0; i < responseObj.length;i++){
					var child = responseObj[i];

					//console.log("Evaluating: " + child.name);
					if(child.name == cubeName){
						//console.log("Found MyReports Folder: " + child.name);
						return callback(null, child.id);

					}
				}


				return callback(null, null);
			}
			else{
				//ERROR
				callback("error", null);
			}
		});
	});
	
	post_req.end();
}

function addDataToCube(tableStructure, cubeID, callback) {
	
	var verb = "POST";
	var path = '/MicroStrategyLibrary/api/datasets';
	if(cubeID == null){
		//console.log("CubeID null -> Must first create cube");
	}
	else{
		//console.log("CubeID exists -> Append Data");
		verb = "PATCH";
		path = '/MicroStrategyLibrary/api/datasets/'+cubeID+'/tables/Table';
	}

	var post_data = tableStructure;
	// An object of options to indicate where to post to
	var post_options = {
	  host: config.host,
	  port: config.port,
	  path: path,
	  method: verb,
	  headers: {
	      'Content-Type': 'application/json',
	      'Accept': 'application/json',
	      'UpdatePolicy': 'Replace',
	      'X-MSTR-AuthToken': _authToken,
	      'X-MSTR-ProjectID': config.projectID,
	      'cookie': _cookie[0]
	  }
	};
	//console.log(post_options);
	var responseString = '';

	// Set up the request
	var post_req = https.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			responseString += chunk;
		});
		res.on('end', function () {

			//console.log(res.statusCode);
			return callback();
		});
	});
	
	post_req.write(post_data);
	post_req.end();
}
