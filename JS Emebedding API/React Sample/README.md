## Purpose

The purpose of this sample is to show a simple React implementation of the MicroStrategy javascript embedding API.

<img src="https://github.com/slippens/MicroStrategy/blob/master/JS%20Emebedding%20API/React%20Sample/results.png"  width="300"/>

## Setup
0) Download this repository
1. Edit the `src/config.json` file within this sample and populate file with your environment variables

   A completed json file should resemble the following:

`{
    "libraryURL": "https://WEBSERVER/MicroStrategyLibrary",
    "projectID":"B7CA92F04B9FAE8D941C3E9B7E0CD754",
    "dossierID": "74004BE011E93463BDB00080EF452FE8",
    "username": "myuser",
    "password":"mypassword"
}`

2. Import the MicroStrategy JS Embedding API <br>
	Open the file `public/index.html` and modify the script tag to point to the embeddingLib.js hosted on your MicroStrategy Library deployment
	`<script src="https:/WEBSERVER/MicroStrategyLibrary/javascript/embeddinglib.js"></script>`
	
3. Set content security policies for cross-domain communication <br>
	By default, MicroStrategy will block other domains from embedding content. You will see the below error in your error log: 
	**Refused to display 'https://[HOST]/MicroStrategyLibrary/auth/ui/embeddedLogin.jsp' in a frame because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'self'".**

	This can be fixed by going to the Library admin page and enabling the setting for #Allow Library embedding in other sites# by going to:
	`http(s)://[WebServer]/MicroStrategyLibrary/admin/webserver`


	
	<img src="https://github.com/slippens/MicroStrategy/blob/master/JS%20Emebedding%20API/React%20Sample/webAdmin.png"  width="500" />


	A webserver restart is required after modifying this value.

4.  Ensure you have npm installed. You can do this with the command `npm -v`. If not, install npm

5.  Navigate to the sample directory and run the install command to install npm package dependencies for this project `npm install`

6.  Start npm to launch sample `npm start`

	Runs the app in the development mode.<br>
	Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
	The page will reload if you make edits.<br>
	You will also see any lint errors in the console.


