## Purpose

The purpose of this sample is to show how to use the REST API to push external data into MicroStrategy. The sample generates random callcenter data every 5 seconds and sends the updated data to MicroStrategy and utilizes:
* login API for session creation
* Session validation to reuse valid sessions or recreate when expired
* Search API to locate if the desired cube exists (and needs to be updated), or doesn't exist and needs to be initially created

The sample is written as a NodeJS application which could be easily extended to solve solutions in production-ready environments. 



<img src="./readmeContent/e2.png"  width="600"/>

<img src="./readmeContent/e1.png"  width="600"/>

<img src="./readmeContent/e3.png"  width="600"/>

## Setup

### Download files

1. Download the files in this repository and deploy them to your computer. 

### Modify the config files for your environment

1. Open the `config.js` file and set the various parameters according to your environment

```javascript
{
	"host":"env-XXXXXX.customer.cloud.microstrategy.com", `webserver hosting the MicroStrategy Library application`
	"port":0, `IServer port`
	"username":"username",  `your username`
	"password":"password", `your password`
	"loginmode":1, `login mode: 1 is standard`
	"projectID":"B7CA92F04B9FAE8D941C3E9B7E0CD754", `ID of project where you'd like the cube to be created`
	"nameOfCubeToCreateOrUpdate":"uploadCube" `Name of cube to create/update - you can make this anything`
}
```

### Run Sample
The sample is written for NodeJS, so you will first want to make sure you have Node installed. `node -v` will validate if you have node installed.

The sample can be run by navigation to the sample and running the command `node dataPublisher.js`

## Additional Documentation
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/RESTSDK/Content/topics/REST_API/REST_API_PushDataAPI_MakingExternalDataAvailable.htm

