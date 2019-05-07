## Purpose

The purpose of this sample is to show how to create fully responsive portal that embeds MicroStrategy content and takes full advantage of the various eventHandlers and manipulations possible, such as:
* Dynamic page navigation
* Dynamic filtering
* selection capturing



<img src="https://github.com/slippens/MicroStrategy/blob/master/Embedding%20API/Responsive%20Portal%20Example/readmeContent/e1.png"  width="600"/>

<img src="https://github.com/slippens/MicroStrategy/blob/master/Embedding%20API/Responsive%20Portal%20Example/readmeContent/e2.png"  width="600"/>

## Setup

### Download files

1. Download the files in this repository and deploy them to your webserver. If using Tomcat, you can create a new folder called `EmbeddingSample` under the `webapps` directory and place all the files in this new folder.

<img src="https://github.com/slippens/MicroStrategy/blob/master/Embedding%20API/Responsive%20Portal%20Example/readmeContent/e3.png"  width="800"/>

### Deploy sample MSTR File

1. Go to MicroStrategy Web and upload the sample dossier (`SampleDossier.mstr` file) by clicking on Create > Upload MSTR File

<img src="https://github.com/slippens/MicroStrategy/blob/master/Embedding%20API/Responsive%20Portal%20Example/readmeContent/e4.png"  width="300"/>

Note - You can also use your own created dossier, but please note the filtering components of this sample were built to leverage multi-select-enabled attribute element selectors. 

### Modify the config files for your environment

1. Open the `config.js` file and set the various parameters according to your environment

<img src="https://github.com/slippens/MicroStrategy/blob/master/Embedding%20API/Responsive%20Portal%20Example/readmeContent/e5.png"  width="800"/>

The projectID can be obtained by right clicking on the desired project in Developer.
The DossierID can be obtained by right click > properties on the desired dossier in Web or Developer

### Configure CORS settings (If hosting on another server other than the MicroStrategy Web server)

1. Go to the MicroStrategyLibrary admin page (`https://[webserver]/MicroStrategyLibrary/admin/webserver`) 
2. Under `Security Settings` check either `All` or `Specific` for the option to allow Library embedding in other sites. If you choose Specific you will need to explicity define the domains that have permission to embed the content.
<img src="https://github.com/slippens/MicroStrategy/blob/master/Embedding%20API/Responsive%20Portal%20Example/readmeContent/e6.png"  width="800"/>

### Run Sample
If deployed to a webserver (like Tomcat), and you used the naming conventions in the sample instructions, the sample can be accessed at the URL:
`http(s)://[Webserver]/EmbeddingSample/index.html`
