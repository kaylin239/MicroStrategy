## Purpose

The purpose of this sample is to show how to obtain an AuthToken when using SAML authentication so that applications can access the token to make additional API calls using the REST API. 

<img src="./readmeContent/e0.png"  width="800"/> 


Since SAML requires a browser redirect, the workflow is:
1) Either:
  a) Create an iframe which will run the SAML SSO url
  b) Embed a dossier using the JS Embedding API
2) Upon success, access the cookie that is generate and extract the authToken
3) Make desired API call

This sample will leverage the first possible workflow by first embedding the SSO URL. This sample assumes that the user has already been authenticated by the SAML provider and so the form is completely hidden. Typically, if the browser has no SAML assertion, a login page will be displayed by the IDP but this sample contains this logic in a hidden frame and so authentication is expected to happen beforehand. The sample may be reworked to support authentication directly from this sample.

This sample then calls the (GET) /sessions/userInfo API and prints the API response on the bottom of the screen.

## Setup

### Prerequisites
1. Secure MicroStrategy Web with a SAML provider (IDP). An example of this can be found in this repository under the sample `SSO and Custom Security/1) SAML authentication for Web (OKTA)`

### Deploy Sample code to web server
1. Download the `SAML_RESTAPI` folder and deploy to web server
2. Open the `config.js` file and edit the parameters to reflect your environment

<img src="./readmeContent/e1.png"  width="800"/>


### Run Sample
Run the sample by running the .html file in your browser. If the files names were kept the sample, it should be accessible at the following URL:
`https://[WEBSERVER]/SAML_RESTAPI/index.html`


<img src="./readmeContent/e0.png"  width="800"/> 


### Official SAML Documentation:
https://www2.microstrategy.com/producthelp/current/SystemAdmin/WebHelp/Lang_1033/Content/enable_saml_for_library.htm
