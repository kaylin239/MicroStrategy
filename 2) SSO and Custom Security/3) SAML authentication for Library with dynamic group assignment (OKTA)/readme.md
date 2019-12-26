## Purpose

The purpose of this sample is to show how leverage OKTA as a SAML SSO provider for MicroStrategy Library, where users in MicroStrategy will be dynamically granted access based on OKTA groups passed within the assertion.

<img src="./readmeContent/a17.png"  width="300"/>

## Setup

### Configure MicroStrategy Intelligence Server for Web SSO 

1) Open MicroStrategy Desktop and edit the Intelligence Server configuration
<img src="./readmeContent/a1.png"  width="300"/>

2) Go to Web Single-Sign-On > Configuration and enable the 3 checkboxes shown in the image below. These settings will allow users who do no currently exist within the MicroStrategy metadata to be created on the fly and have their security updated based on values provided in the SAML assertion.
<img src="./readmeContent/a2.png"  width="300"/>


### Configure MicroStrategy Library for SAML Authentication
1) To to the Library admin page 'https://[WEBSERVER]/MicroStrategyLibrary/admin' and go to the 'Library Server' tab. 
2) Ensure that SAML authentication is enabled
3) Ensure that a Trust relationship is established between the Library and Intelligence Server. If this is not setup, go through the wizard on this page to set this security component up.
<img src="./readmeContent/a3.png"  width="300"/>

### Create a test user within OKTA
1) Within the OKTA admin page, go to the users page and create a group and user, and assign this user to the group. In this test case, the group is called 'OktaTest'. In this scenario, the goal is to dynamically create this user in MicroStrategy and apply this user permissions in MicroStrategy defined by the usergroup 'OktaTest'. This group will need to exist in the metadata and have the appropriate permissions assigned ahead of time. 
<img src="./readmeContent/a4.png"  width="300"/>

### Generate SAML configuration files using the Library SAML config page
1) go to the SAML setup page 'https://[Webserver]/MicroStrategyLibrary/saml/config/open' 
2) Specify a unique ID for the Entity ID which will represent the MicroStrategy Library application as a service provider (SP)
<img src="./readmeContent/a5.png"  width="300"/>
In this example, we will be using the default asserting variable names for all other fields, but these may also be altered based on IDP requirements.
3) Click 'Submit' to complete this part of the configuration.

### Confirm creation of SAML config files and locate the SSO URL
1) Within the MicroStrategy Library web application, navigate to MicroStrategyLibrary/WEB-INF/classes/auth/SAML/. You will see that 3 files were generated (MstrSamlConfig.xml, SamlKeystore.jks, SPMetadata.xml)
2) Open the SPMetadata.xml file.
<img src="./readmeContent/a6.png"  width="300"/>

3) Search for 'SSO' and copy the URL that comes up from the search. This is the SP login URL that the OKTA IDP will need in the next step.
<img src="./readmeContent/a7.png"  width="300"/>

### Create a SAML 2.0 application within OKTA
1) Go back to the OKTA admin console and select the 'Add Application' option
<img src="./readmeContent/a8.png"  width="300"/>

2) Create a SAML 2.0 application 
<img src="./readmeContent/a9.png"  width="300"/>

3) For the 'Single sign on URL' field, provide the URL obtained from the SPMetadata.xml file
4) Set the SP Entity ID as the unique ID specified when generating the SAML configuration files for Library. In our example it is 'SP_ENTITY'
<img src="./readmeContent/a10.png"  width="300"/>
5) Under the 'Group Attribute Statements', set the parameter as 'Groups' and set the filter rules to locate the group(s) that you would like to sync. In our example, we want to pass over the group 'OktaTest' if present on the OKTA user. 
<img src="./readmeContent/a16.png"  width="300"/>

6) Step through the rest of the setup guide until complete.

### Obtain and deploy the IDPMetadata within Library
1) Once the application is configured, click on the link shown in the screenshot below to obtain the Identity Provider (IDP) metadata. 
<img src="./readmeContent/a11.png"  width="300"/>
<img src="./readmeContent/a12.png"  width="300"/>

2) Copy this content and navigate back to MicroStrategyLibrary/WEB-INF/classes/auth/SAML/.
3) Create a file called 'IDPMetadata.xml' and paste the contents into this file.


<img src="./readmeContent/a13.png"  width="300"/>

### Assign OKTA users to the OKTA application created
For a user to be allowed to leverage the OKTA application, the user must be assigned to it. 
1) Go to the OKTA Admin Page and open the newly created SAML 2.0 application.
2) Click on the 'Assignments' tab and assign the user created earlier in this guide.

<img src="./readmeContent/a14.png"  width="300"/>

### Ensure a group in MicroStrategy matches the OKTA group and has all required permissions
1) In MicroStrategy Developer, ensure that a group called 'OktaTest' exists and has the various ACLs and permissions you would like the user to have when accessing MicroStrategy. 
<img src="./readmeContent/a15.png"  width="300"/>

### Restart the WebServer
1) Restart the Webserver so that all the modifications made can take place. 

When accessing the MicroStrategyLibrary application, you should now be presented with the OKTA login page, or be automatically logged in if a valid assertion already exists within your browser session.

<img src="./readmeContent/a17.png"  width="300"/>



### Official Documentation:
 Please refer to the official documentation for more details.
https://www2.microstrategy.com/producthelp/current/SystemAdmin/WebHelp/Lang_1033/Content/enable_saml_for_library.htm
