'use strict';
const Alexa = require('alexa-sdk');
var https = require('https');

var config = {
    "projectID": "B7CA92F04B9FAE8D941C3E9B7E0CD754",
    "username" : "mstrUser",
    "password": "mstrPassword",
    "webserver" : "env-127948.customer.cloud.microstrategy.com",
    "cubeID" : "D4D8436C11E93B7235A40080EFD52414",
};



//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Space Facts';
const HELP_MESSAGE = ' What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';



//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
                this.response.speak("Hello!");
                this.emit(':responseReady');
    },
    'Unhandled': function(){
        this.response.speak("Couldnt resolve intent");
                this.emit(':responseReady');
    },
    'dataIntent': function () {
        var me = this;
        
        console.log(this.event.request.intent.slots);
        
        //slot checks:
        var year = null;
        var subcategory = null;
        
         if (this.event.request.intent.slots.year.value) {
            year = this.event.request.intent.slots.year.value;
            console.log("Have year value of: " + year);
        }
        
          if (this.event.request.intent.slots.subcategory.value) {
            subcategory = capitalizeFirstLetter( this.event.request.intent.slots.subcategory.value);
            console.log("Have subcategory value of: " + subcategory);
        }
        
        
        getRestSession(function(error, token, cookie){
            //speak error if present:
            if(error){
                me.response.speak(error);
                me.emit(':responseReady');
                return;
            }
            //continue: -> mstr token/cookie are present
            console.log("MSTR Token present, continue");
            
            //Now query desired data from cube:
            getCubeDefinition(token, cookie,config.cubeID, function(error, cubeDef){
                if(error){
                    me.response.speak(error);
                    me.emit(':responseReady');
                    return;
                }
                console.log("Got cubeDef");
                
                console.log(cubeDef);
                //Have cubeDef -> now send POST to cube with desired template objects + filters
                
                var requiredAttributeNames = ['Year', 'Subcategory'];
                var requiredMetricNames = ['Profit'];
                
                //Form cubePost data based on required attributes, metrics, and filters
                //NOTE -> ORDER OF FILTERS SEEM TO MATTER. START FROM LEFT TO RIGHT BASED ON ATTRIBUTES ADDED
                var filters = [{'name':'Year', 'element':year, 'type':'attribute'},{'name':'Subcategory', 'element':subcategory, 'type':'attribute'}];
                var postData = formCubePostData(cubeDef, requiredAttributeNames, requiredMetricNames, filters);
                console.log(JSON.stringify(postData));
            
                getCubeData(token, cookie,config.cubeID, postData, function(err, cubeData){
                    if(err){
                        console.log("have error: " + err);
                        me.response.speak(err);
                        me.emit(':responseReady');
                        return;
                    }
                
                    console.log("Have cube data:");
                    console.log(JSON.stringify(cubeData));
                    
                    var metricValue = null;
                
                    var root = cubeData.result.data.root;
                    //console.log(root);
                    var child = getLastChild(root);
                    console.log("last child");
                    console.log(JSON.stringify(child));
                    var metrics = child.metrics;
                    var metricName = Object.keys(metrics)[0];
                    var metric = metrics[metricName];
                    metricValue = metric.fv;
                    
                    var speechOutput = "Profit for " + subcategory + ' in ' + year + ' is ' + metricValue;
                    
                    me.response.speak(speechOutput);
                    me.emit(':responseReady');
               
                     
                });
                
               
                
            });
            
        });
        
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

function getElementNameForDepth(depth, obj){
   
        var child = obj;
        for(var i = 0; i < depth+1; i++){
            child = getNextChild(child);
        }
        
    console.log(JSON.stringify(child));
    var element = child.element.name;
    console.log("element: " + element);
   
   return element;
}

function getChildForDepth(depth, obj){
   
        var child = obj;
        for(var i = 0; i < depth+1; i++){
            child = getNextChild(child);
        }
        
   return child;
}

function getNextChild(obj){
    var child = obj.children[0];
    console.log("DEPTH: " + child.depth);
    return obj.children[0];
}

function getLastChild(obj){
    if(obj.children != undefined){
        //console.log("child");
        return getLastChild(obj.children[0]);
    }
    else{
        return obj;
    }
    
}

function getRestSession(callback){
    var post_data = '{\"username\": \"'+config.username+'\",\"password\": \"'+config.password+'\"}';
    //console.log(post_data);

  // An object of options to indicate where to post to
  var post_options = {
      host: config.webserver,
      port: '443',
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
              return callback(null, token, cookie);
          }
          else{
              var error = "The cloud server " + config.cloudEnvNumber + " is running, but there was an error creating a session. Please check your credentials and try again.";
                return callback(error, null, null);
          }
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
        

   
  
}

function getCubeDefinition(token,cookie,cubeID, callback){
    console.log("Get cube definition:");

    var projectID = config.projectID;
    var post_data = '';
    
     // An object of options to indicate where to post to
  var post_options = {
      host:config.webserver,
      port: '443',
      path: '/MicroStrategyLibrary/api/cubes/' + cubeID,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-MSTR-AuthToken':token,
          'X-MSTR-ProjectID':projectID,
          'cookie': cookie[0]
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
          return callback(null, JSON.parse(responseString));
          
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

function getCubeData(token,cookie,cubeID, postData, callback){
    console.log("Get cube data:");

    var projectID = config.projectID;
    
    var path = '/MicroStrategyLibrary/api/cubes/' + cubeID + '/instances?limit=1000';
    console.log("path: " + path);
    
     // An object of options to indicate where to post to
  var post_options = {
      host:config.webserver,
      port: '443',
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-MSTR-AuthToken':token,
          'X-MSTR-ProjectID':projectID,
          'cookie': cookie[0]
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
         // console.log(responseString);
          var responseObj = JSON.parse(responseString);
          var error = null;
          if(responseObj.message != undefined){
              console.log("ERROR");
              error = responseObj.message;
          }
          //console.log("should get error: " + error);
          return callback(error, responseObj);
          
      });
  });

  // post the data
  post_req.write(JSON.stringify(postData));
  post_req.end();

}

function formCubePostData(cubeDef, requiredAttributeNames, requiredMetricNames, filters){
    
    var postData = {"requestedObjects":{"attributes":[],"metrics":[]}};
    
    for(var i = 0; i < requiredAttributeNames.length; i++){
        var obj = requiredAttributeNames[i];
        var objID = getIDFromCubeDef(cubeDef, obj, 'attribute');
        console.log("Obj: " + obj + " ID: " + objID);
        
        postData.requestedObjects.attributes.push({'id':objID});
    }
    
    for(var i = 0; i < requiredMetricNames.length; i++){
        var obj = requiredMetricNames[i];
        var objID = getIDFromCubeDef(cubeDef, obj, 'metric');
        console.log("Obj: " + obj + " ID: " + objID);
        
        postData.requestedObjects.metrics.push({'id':objID});
    }
    
    //Form filter:
    var filter = {"operator":"And","operands":[]};
    
    for(var i = 0; i < filters.length; i++){
        var filterRequest = filters[i];
         
        if(filterRequest.type == 'attribute'){
            var objID = getIDFromCubeDef(cubeDef, filterRequest.name, filterRequest.type);
            var elementID = 'h' + filterRequest.element + ';' + objID;
            var component = {"operator":"In","operands":[{"type":"attribute","id":objID},{"type":"elements","elements":[{"id":elementID}]}]};
            
            filter.operands.push(component);
    
        }
        else{
            console.log("havent built this protoype to support metric filters");
        }
    }
    //console.log("filter");
    //console.log(JSON.stringify(filter));
    postData.viewFilter = filter;
    return postData;
}

function getIDFromCubeDef(cubeDef, name, type){
    
    if(type == 'attribute'){
        var cubeDefAttributes = cubeDef.result.definition.availableObjects.attributes;
        
        for(var i = 0; i < cubeDefAttributes.length; i++){
            var cubeDefObj = cubeDefAttributes[i];
            
            if(cubeDefObj.name == name){
                return cubeDefObj.id;
            }
        }
    }
    if(type == 'metric'){
        var cubeDefMetrics = cubeDef.result.definition.availableObjects.metrics;
        
        for(var i = 0; i < cubeDefMetrics.length; i++){
            var cubeDefObj = cubeDefMetrics[i];
            
            if(cubeDefObj.name == name){
                return cubeDefObj.id;
            }
        }
    }
    return null;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
