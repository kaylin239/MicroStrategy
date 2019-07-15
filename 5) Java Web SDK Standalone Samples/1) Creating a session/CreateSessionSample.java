package github.standalone;

import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectsException;
import com.microstrategy.web.objects.WebObjectsFactory;

public class CreateSessionSample {

	static String server_name = "XXX.XXX.XXX.XXX"; //IP or FQDN for MSTR Intelligence Server
	static String server_port = "0"; //MSTR Intelligence Server Port
	static String project_name = "MicroStrategy Tutorial"; //Project to create session for
	static String admin_username = "username"; //MSTR Username
	static String admin_password = "password"; //MST Password
	
	public static void main(String[] args) {	
		try{
			WebIServerSession mstrSession = createSession();
			System.out.println("Session created");		
		}
		catch (WebObjectsException e){
			System.out.println("Error creating session");
		}
	}
	
	public static WebIServerSession createSession() throws WebObjectsException{
		WebObjectsFactory factory=WebObjectsFactory.getInstance();
		WebIServerSession serverSession=factory.getIServerSession();
		serverSession.setServerName(server_name);
		serverSession.setProjectName(project_name);
		serverSession.setServerPort(Integer.parseInt(server_port));
		serverSession.setLogin(admin_username);
		serverSession.setPassword(admin_password);
	   
		//Call getSessionID to submit credentials and return ID for valid, active session
		System.out.println("SessionID: " + serverSession.getSessionID());
		
		//Return for use elsewhere.
		return serverSession;	
	}
}
