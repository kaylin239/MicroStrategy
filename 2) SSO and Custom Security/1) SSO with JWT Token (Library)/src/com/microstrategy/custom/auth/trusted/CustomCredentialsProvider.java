package com.microstrategy.custom.auth.trusted;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Enumeration;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import com.microstrategy.auth.credentials.ISeverCredentialsProvider;
import com.microstrategy.auth.sessionmgr.IServerCredentials;
import com.microstrategy.auth.sso.SSOIServerCredentials;
import com.microstrategy.web.beans.BeanFactory;
import com.microstrategy.web.beans.UserBean;
import com.microstrategy.web.beans.WebBeanException;
import com.microstrategy.web.objects.SimpleList;
import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectInfo;
import com.microstrategy.web.objects.WebObjectsException;
import com.microstrategy.web.objects.WebObjectsFactory;
import com.microstrategy.web.objects.WebSearch;
import com.microstrategy.web.objects.admin.users.WebSimpleSecurityPluginLoginInfo;
import com.microstrategy.web.objects.admin.users.WebUser;
import com.microstrategy.web.objects.admin.users.WebUserEntity;
import com.microstrategy.web.objects.admin.users.WebUserGroup;
import com.microstrategy.webapi.EnumDSSXMLObjectSubTypes;
import com.microstrategy.webapi.EnumDSSXMLObjectTypes;
import com.microstrategy.webapi.EnumDSSXMLSearchDomain;
import com.microstrategy.webapi.EnumDSSXMLSearchFlags;


public class CustomCredentialsProvider implements ISeverCredentialsProvider {
	//Configuration variables
	static String nodeApiUrl = "WEBSERVER:3000";
	static String serverName = "ISERVER_IP";
	static String projectName = "MicroStrategy Tutorial";
	static int adminAuthMode = 1; //standard
	static int port = 0;
	static String adminUser = "USER";
	static String adminPass = "PASSWORD";
	
	public CustomCredentialsProvider() {  
		super(); 
	} 
 
	public IServerCredentials getIServerCredentials(HttpServletRequest request) {
		System.out.println("Calling getIServerCredentials");
		
		SSOIServerCredentials credentials = new SSOIServerCredentials(request);
	    credentials.setAuthMode(64);
	    
	    
	    //Find path user took for authentication - handle accordingly
		String servletPath = request.getServletPath();
	    System.out.println("Servlet path " + servletPath);
	    
	    if(servletPath.equalsIgnoreCase("/api")){
	    	//Came in from REST API
	    	System.out.println("Auth Request came from REST API call");
	    	
	    	//Get JWT Token from the client request (as post parameter)
		    String jwtToken = getJWTFromPostRequest(request);
		    if(jwtToken == null){
		    	System.out.println("Error, JWT not found");
		    	//return credentials in current state -> will throw error
		    	return credentials;
		    }
		    
		    //Continue process
		    System.out.println("JWT: " + jwtToken);
		    
		    //Now that we have the token, we will pass it to a 3rd party (nodeJS) system for validation and to receive user parameters
		   JSONObject userInfoJson = doPost(jwtToken);
		   System.out.println("Token Info: " + userInfoJson);
		   
		   /* This sample will assume the mstr user's username and trustID are the same.
		   * The next steps will be to validate if the user currently exists
		   * If user exists -> assign to appropriate usergroups then login
		   * If user doesn't exist -> Create user then assign to appropriate user groups
		   */
		    
		   String userName = userInfoJson.getString("user");
		   String trustID = userInfoJson.getString("user");
		   String userGroup = userInfoJson.getString("group");
		   
		   //Get admin session for metadata search for user
		   WebIServerSession adminSession = getAdminSession();
		   
		   //Search the metadata to see if a user with the userID exists in metadata:
		   WebUser user = searchForUserWithLoginID(userName, adminSession);
		   
		   if(user != null){
				System.out.println("User exists, remove from current groups then assign group");
				//remove from all groups
				removeUserFromAllGroups(adminSession, user);
				
				//assign to group
				assignUserToGroup(user, userGroup, adminSession);
			}
			else{
				System.out.println("User doesnt exist, create now");
				createUser(userName, trustID, userGroup, adminSession);
			}
		    
		   	System.out.println("User now exists and has been assigned to appropriate group -> login");
	    	
		   	//assign TrustID for user authentication
		   	credentials.setUsername(trustID);
		   	
		   	//Return the successfully built credentials object
		   	return credentials;
	    }
	    else{
	    	//Came in from library URL
	    	System.out.println("Auth Request came from running Library URL");
	    	return getIServerCredentials(request);
	    }
	    
	}

	public String getJWTFromPostRequest(HttpServletRequest request){
		 //Get JWT Token from the client request (as post parameter)
	    String jwtToken = null;
	    Enumeration parameterEnum = request.getParameterNames();
	    while (parameterEnum.hasMoreElements()) {
	      String param = (String)parameterEnum.nextElement();
	      System.out.println("key: " + param + " value: " + request.getParameter(param));
	      jwtToken = param;
	    }
	    return jwtToken;
	}
	
	public JSONObject doPost(String token){
		try {		
			String url = nodeApiUrl;
			URL obj = new URL(url);
			HttpsURLConnection con;
		
			con = (HttpsURLConnection) obj.openConnection();
		
			//add reuqest header
			con.setRequestMethod("POST");
			//con.setRequestProperty("User-Agent", USER_AGENT);
			con.setRequestProperty("Content-Type", "application/json");

			String urlParameters = "{\"token\":"+token+"}";
			
			// Send post request
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.flush();
			wr.close();

			int responseCode = con.getResponseCode();
			System.out.println("\nSending 'POST' request to URL : " + url);
			System.out.println("Post parameters : " + urlParameters);
			System.out.println("Response Code : " + responseCode);

			BufferedReader in = new BufferedReader(
			        new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			
			String responseString = response.toString();
			
			//convert to JSON
			JSONObject jsonObj = new JSONObject(responseString);
			//System.out.println(jsonObj);
			
			
			return jsonObj;
			} 
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public WebIServerSession getAdminSession(){
		//We need an admin session to perform a metadata search:
		WebObjectsFactory objectFactory = WebObjectsFactory.getInstance();
		WebIServerSession adminSession = objectFactory.getIServerSession();
		adminSession.setServerName(serverName);
		adminSession.setProjectName(projectName);
		adminSession.setServerPort(port);
		adminSession.setAuthMode(adminAuthMode);  //standard auth
		adminSession.setLogin(adminUser);
		adminSession.setPassword(adminPass);
		
		String sessionState;
		try {
			sessionState = adminSession.getSessionID();
			System.out.println("Obtained admin session: " + sessionState);
			return adminSession;
		} catch (WebObjectsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			
		return null;
	}

	public WebUser searchForUserWithLoginID(String userID, WebIServerSession adminSession){
		WebSearch webSearch=adminSession.getFactory().getObjectSource().getNewSearchObject();
		webSearch.setSearchFlags(EnumDSSXMLSearchFlags.DssXmlSearchNameWildCard+EnumDSSXMLSearchFlags.DssXmlSearchRootRecursive);
		//Use a simple list to restrict the search to only User Objects
		SimpleList searchTypes = webSearch.types();
		Integer type=new Integer(EnumDSSXMLObjectTypes.DssXmlTypeUser);
		searchTypes.add(type);
		//Note: Use the Abbreviation Pattern, not the Name Pattern to search on Login ID
		webSearch.setAbbreviationPattern(userID);
		//set the Domain to search the entire Repository
		webSearch.setDomain( EnumDSSXMLSearchDomain.DssXmlSearchDomainRepository );
		webSearch.setAsync(false);
		WebObjectInfo objectInfo = null;
		//Execute the search
		try {
			webSearch.submit();
			if (webSearch.getResults().isEmpty()){
				System.out.println("No user by name "+userID);
			}
			else {
				objectInfo = webSearch.getResults().get(0);
				System.out.println("Found user: " + objectInfo.getDisplayName());
			
				WebUser user = (WebUser)objectInfo;
				return user;
			}
		}
		catch (Exception e){
			System.out.println("Search failed: "+e);
			return  null;
		}
		return null;
	}

	public WebUserGroup searchForGroupWithName(String groupName, WebIServerSession adminSession){
		WebSearch webSearch=adminSession.getFactory().getObjectSource().getNewSearchObject();
		webSearch.setSearchFlags(EnumDSSXMLSearchFlags.DssXmlSearchNameWildCard+EnumDSSXMLSearchFlags.DssXmlSearchRootRecursive);
		//Use a simple list to restrict the search to only User Objects
		SimpleList searchTypes = webSearch.types();
		Integer type=new Integer(EnumDSSXMLObjectSubTypes.DssXmlSubTypeUserGroup);
		searchTypes.add(type);
		//Note: Use the Abbreviation Pattern, not the Name Pattern to search on Login ID
		webSearch.setAbbreviationPattern(groupName);
		//set the Domain to search the entire Repository
		webSearch.setDomain( EnumDSSXMLSearchDomain.DssXmlSearchDomainRepository );
		webSearch.setAsync(false);
		WebObjectInfo objectInfo = null;
		//Execute the search
		try {
			webSearch.submit();
			if (webSearch.getResults().isEmpty())
				System.out.println("No user by name "+groupName);
			else {
				objectInfo = webSearch.getResults().get(0);
				System.out.println("Found user: " + objectInfo.getDisplayName());
			
				WebUserGroup group = (WebUserGroup)objectInfo;
				return group;
			}
		}
		catch (Exception e){
			System.out.println("Search failed: "+e);
			return  null;
		}
		return null;
	}
	
	public void createUser(String username, String trustID, String groupName,  WebIServerSession adminSession){
		 UserBean user = null;

	        try {
	            //Instantiate a new user
	            user = (UserBean)BeanFactory.getInstance().newBean("UserBean");
	            user.setSessionInfo(adminSession);
	            user.InitAsNew();
	            //Fetch properties for the user
	            WebUser ua = (WebUser) user.getUserEntityObject();
	            //Set basic user information
	            ua.setLoginName(username);
	            ua.setFullName(username);
	            //Set trustID 
	            //https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/WebSDK/Content/topics/objbeans/Creating_a_User.htm
	            WebSimpleSecurityPluginLoginInfo userSecurityInfo = user.getUserEntityObject().getSimpleSecurityPluginLoginInfo();
	            userSecurityInfo.setUid(trustID);
	            user.save();
	            
	            //add user to group:
	           
	            WebUser webUser = searchForUserWithLoginID(username, adminSession);
	            
	            WebUserGroup group = searchForGroupWithName(groupName, adminSession);
	           
	            
	            System.out.println("User: " + webUser.getName());
	            System.out.println("Group: " + group.getName());
	            try {
	               
	                if(group!=null){
	                    //Add user to group
	                    if(user!=null){
	                    	System.out.println("Adding user to group: " + username + " : " + groupName);
	                        group.getMembers().add(webUser);
	                    }
	                }
	                //Save the group object
	                adminSession.getFactory().getObjectSource().save(group);
	            } catch (WebObjectsException e) {
	                e.printStackTrace();
	            }
	           
	        } catch (WebBeanException ex) {

	            System.out.println("Error creating a user: " + ex.getMessage());

	        }
	}

	public void assignUserToGroup(WebUser webUser, String groupName, WebIServerSession adminSession){
		
		//Remove user from all current groups:
		
		
		
		//add user to group:

        WebUserGroup group = searchForGroupWithName(groupName, adminSession);
       
        System.out.println("User: " + webUser.getName());
        System.out.println("Group: " + group.getName());
        try {
           
            if(group!=null){
                //Add user to group
                if(webUser!=null){
                	System.out.println("Adding user to group: " + groupName);
                    group.getMembers().add(webUser);
                }
            }
            //Save the group object
            adminSession.getFactory().getObjectSource().save(group);
        } catch (WebObjectsException e) {
            e.printStackTrace();
        }
	}

	public void removeUserFromAllGroups(WebIServerSession adminSession, WebUser webUser){
		try {
			WebUserEntity[] entities = webUser.getAncestorGroups();
			//System.out.println("Count: " + entities.length);
			for(int i = 0; i < entities.length; i++){
				WebUserEntity entity = entities[i];
				//System.out.println("Entity name: " + entity.getName());
				WebUserGroup group = (WebUserGroup) entity;
				System.out.println("user: " +webUser.getName() + " removed from group: " + group.getName());
				group.getMembers().remove(webUser);
				adminSession.getFactory().getObjectSource().save(group);
			}
		} catch (WebObjectsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}   
	}

}
