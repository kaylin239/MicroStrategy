## Purpose

The purpose of this sample is to show how to use the REST API to push external data into MicroStrategy. The sample generates 1 random row of data and will either:

- Initially create a new cube and push the generated row of data into it
or
- Detect that the cube already exists and pushs the additional row of data into the existing cube




<img src="./readmeContent/e1.png"  width="600"/>


## Setup

### Download files

1. Download the files in this repository and deploy them to your webserver.

### Modify the config files for your environment

1. Open the `config.js` file and set the various parameters according to your environment

```javascript
{
	"host":"env-XXXXXX.customer.cloud.microstrategy.com", //webserver hosting the MicroStrategy Library application
	"port":0, //IServer port
	"username":"username",  //your username
	"password":"password", //your password
	"loginmode":1, //login mode: 1 is standard
	"projectID":"B7CA92F04B9FAE8D941C3E9B7E0CD754", //ID of project where you'd like the cube to be created
}
```

### Run Sample
Run the html sample from your webserver. If the sample seems to fail, run the sample with (browser) developer tools running to view potential errors in the console. Odds are that the credentials provided were incorrect or you are running on a non SSL secured environment (this can be fixed by switching the code to use HTTP).


## Additional Documentation
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/RESTSDK/Content/topics/REST_API/REST_API_JSONDataAPI_Workflow.htm

