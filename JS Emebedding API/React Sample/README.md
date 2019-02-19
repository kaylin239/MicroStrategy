## Purpose

The purpose of this sample is to show a simple React implmenentation of the MicroStrategy javascript embedding API.

![Alt text](https://github.com/slippens/MicroStrategy/blob/master/JS%20Emebedding%20API/React%20Sample/results.png "Title")

## Setup

1) Edit the src/config.json file with your environment variables
2) Set content security policies for cross-domain communication
	By default, MicroStrategy will block other domains from embedding content. You will see the below error in your error log: 
	Refused to display 'https://[HOST]/MicroStrategyLibrary/auth/ui/embeddedLogin.jsp' in a frame because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'self'".

	This can be fixed by going to the Library admin page and enabling the setting for 'Allow Library embedding in other sites' by going to:
	http(s)://[WebServer]/MicroStrategyLibrary/admin/webserver


	A webserver restart is required after modifying this value.



### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Learn More
To learn React, check out the [React documentation](https://reactjs.org/).


