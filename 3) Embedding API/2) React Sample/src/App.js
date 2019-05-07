import React, { Component } from 'react';
import './App.css';
let config = require('./config.json')

class App extends Component {
    
  render() {
    //create the div we need
    return (
        <div>
            <div className="App" id="dossierContainer1"></div>
        </div>
    );
  }

  //Render dossier once the component is mounted
  componentDidMount(){
        renderDossier();
    }
} 

function renderDossier() {
    //Defined by app
    const divID = "dossierContainer1";
  

    //defined by MSTR environment
    var baseRestURL =config.libraryURL;
    var projectID = config.projectID;
    var dossierID = config.dossierID;
    var username = config.username;
    var password = config.password;

    //Set payload for POST request
    const postData = {};
    postData.username = username;
    postData.password = password;
    postData.loginMode = 1;

    //Form DossierURL for embeeding parameter
    var projectUrl = baseRestURL + '/app/' + projectID;
    var dossierUrl = projectUrl + '/' + dossierID;
    console.log("DossierURL: " + dossierUrl);

    //Obtain div for embedding parameter
    var div = document.getElementById(divID);

    //populate div with Dossier:
    window.microstrategy.dossier
        .create({
            placeholder: div,
            url: dossierUrl,
            enableCustomAuthentication: true,
            enableResponsive: true,
            containerWidth: div.width,
            containerHeight: div.height,
            customAuthenticationType: window.microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
            getLoginToken: function() {
            return getXHRRequestPromise(baseRestURL + '/api/auth/login', postData, 'POST', 'application/json', 'x-mstr-authToken').then(function(authToken) {
                return authToken;
            })
        }
        })
        .then(function(dossier) {
            console.log("Dossier should be loaded!!!");
            //any code you want to run after dossier loads
        });

}

function getXHRRequestPromise(url, body, method, contentType, desiredHeader) {
    console.log("Calling getXHRRequestPromise");
      return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.withCredentials = true;
            xhr.setRequestHeader("Content-Type", contentType);
            xhr.setRequestHeader("Accept", contentType);
            xhr.send(JSON.stringify(body));
            xhr.onreadystatechange =
                function() {
                    if (xhr.readyState === 2) {
                        console.log("OK");
                        resolve(xhr.getResponseHeader(desiredHeader));
                    } else {
                        console.log("ready state: " + xhr.readyState);
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };
        });


}

export default App;
