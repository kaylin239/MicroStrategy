## Purpose

The purpose of this sample is to show how to create an Alexa Skill that is able to ask questions against a dataset contained within MicroStrategy. This particular sample utlizes in-memory cube datasets, but it can be easily modified to pull against report datasets as well. 

<img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/questions.png"  width="300"/>

## Setup

### Prepare the data within MicroStrategy

1. Import the included dataset.xlsx file as a cube

   In MicroStrategy Web `Create > Add External Data`
  
   <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/1.png"  width="150"/>
  
2. Click finish and save cube.

  <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/2.png"  width="500"/>
  
3. Right click on the created cube and go to properties to get the cube ID

    <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/3.png"  width="300"/>
        <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/4.png"  width="400"/>

### Create the Alexa Skill

1. Go to https://developer.amazon.com/alexa
2. Click on ‘Skill Builders’ and click ‘Start a skill’
 
     <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/5.png"  width="600"/>

3. Click `Create Skill` in the top right corner
4. Select `Custom Skill`, fill out a skill name, and click `Create Skill` in the top right corner.
     <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/6.png"  width="600"/>
     

5. For the template, select `Fact Skill`. We will delete all the pre-generated code, but this template already includes a number of additional libraries we will take use of for our project.
     <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/7.png"  width="600"/>
 

6. On the left panel, click `JSON Editor` and paste in the contents from the **skill.json** file included in this repository.
      <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/8.png"  width="600"/>

Click `Save Model` and then `Build Model`. This process may take a few minutes to complete. A popup will appear when finished.

### Create the Lambda Endpoint

1. Go to https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
2. Login to your account

3. Click `Create function` in the top right
4. Select the option for ‘blueprints’ and select the fact or trivia nodeJS template. We will not use the code from this template, but it imports a number of frameworks we will need for our own purposes.

5. Fill out a name and role for the skill and click ‘create function’ on the bottom of the screen
      <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/9.png"  width="600"/>

6. Under the designer tab, add the trigger ‘Alexa Skills Kit’. In the window below, check ‘disable’ on Skill ID verification. (This is a security implementation to ensure only specific skills can leverage this lambda function, for demo purposes we will not perform a check, but in production you would want to perform this validation.) 
      <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/10.png"  width="600"/>
       <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/11.png"  width="600"/>
7. Click `Save` in the top right and reload the window. (The code editor seems to disappear when triggers are added, refreshing the window will bring it back).

8. Replace the entire code contents of the `index.js` with the provided **index.js** contained within this repository.

9. Modify the Config object defined on line 5 with information from your own MicroStrategy environment. (You will need to use Desktop or the REST API to obtain your project ID, the other IDs can be obtained through web).
       <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/12.png"  width="600"/>

10. Copy the ARN for the lambda function shown in the top right corner
        <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/13.png"  width="600"/>

### Add Lambda endpoint to Alexa Skill

1. Go back to the Alexa Skill, click on the `endpoint` section on the left, and provide your ARN as the default region value.
        <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/14.png"  width="600"/>
 
2. Click `Save Endpoints` on the top of the screen

### Skill Testing

1. On the top menu, click `test` and set skill testing enabled for `Development`.
        <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/15.png"  width="600"/>
 
2. The launch request was hardcoded to respond ‘hello’. Try typing `Launch demo skill` to see if everything was setup properly
        
<img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/16.png"  width="300"/>

3. Next, let’s try asking a question on the data. 
`Ask demo skill what is my profit for computers in 2016`
         <img src="https://github.com/slippens/MicroStrategy/blob/master/Alexa%20Skill%20Samples/Skill%20using%20MSTR%20cubes/readme%20images/17.png"  width="300"/>
 

You can try various combinations of subcategory elements and years present in the sample dataset.

### additional info
You can test this on a physical alexa device by simply logging into the device with the amazon account that developed the skill (as long as you set the skill as in development). 
