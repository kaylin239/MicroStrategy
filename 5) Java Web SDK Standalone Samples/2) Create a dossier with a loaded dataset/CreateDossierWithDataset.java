package github.standalone;


import com.microstrategy.web.beans.RWBean;
import com.microstrategy.web.beans.WebBeanFactory;
import com.microstrategy.web.objects.WebDocumentInstance;
import com.microstrategy.web.objects.WebFolder;
import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectInfo;
import com.microstrategy.web.objects.WebObjectSource;
import com.microstrategy.web.objects.WebObjectsFactory;
import com.microstrategy.web.objects.WebReportDefinitionImpl;
import com.microstrategy.web.objects.WebReportInstance;
import com.microstrategy.web.objects.rw.RWInstance;
import com.microstrategy.web.objects.rw.RWManipulation;
import com.microstrategy.web.objects.rw.RWSource;
import com.microstrategy.webapi.EnumDSSXMLApplicationType;
import com.microstrategy.webapi.EnumDSSXMLDocSaveAsFlags;
import com.microstrategy.webapi.EnumDSSXMLObjectFlags;
import com.microstrategy.webapi.EnumDSSXMLObjectTypes;

public class CreateDossierWithDataset {
	
	static String server_name = "XXX.XXX.XXX.XXX"; //IP or FQDN for MSTR Intelligence Server
	static int server_port = 0; //MSTR Intelligence Server Port
	static String project_name = "MicroStrategy Tutorial"; //Project to create session for
	static String username = "myUser"; //MSTR Username
	static String password = "myPass"; //MST Password
	
	static String dossierTemplateID = "37538ACA11E91D9033990080EFA53F83";  //Cannot create dossier from scratch. To work around this, we can create and save a 100% empty dossier and use it as a template by duplicating it then performing manipulations
	static String datasetID = "520A3B3411E91D90D4C10080EF254083"; //Dataset to add to dossier
	static String saveFolderID = "2339722A11E91D90091D0080EF8580D3"; //folder to save newly manipulated dossier
	static String saveName = "SDK Dossier_" + System.currentTimeMillis(); //Name to save new dossier as
	
	
	
	public static void main(String[] args) {
		System.out.println("Begin");
		// TODO Auto-generated method stub
		String SessionID = "";
	
	//  Create factory object.
	   WebObjectsFactory factory=WebObjectsFactory.getInstance();
	   WebIServerSession serverSession=factory.getIServerSession();                                                     
	//  Set up session properties
	   serverSession.setServerName(server_name);
	   serverSession.setProjectName(project_name);
	   serverSession.setServerPort(server_port);
	   
	   serverSession.setLogin(username);
	   serverSession.setPassword(password);
	   serverSession.setApplicationType(EnumDSSXMLApplicationType.DssXmlApplicationCustomApp);
	     
	   try {   
	   SessionID = serverSession.getSessionID();
	   System.out.println("Got session: " + SessionID);
	  
	   //Instantiate dossier from template object.
	   WebObjectInfo objInfo = factory.getObjectSource().getObject(dossierTemplateID, EnumDSSXMLObjectTypes.DssXmlTypeDocumentDefinition );
	   objInfo.populate();
	   String docId = objInfo.getID();
	   RWInstance rwi = factory.getRWSource().getNewInstance(docId);
	   rwi.pollStatus();
	   
	   System.out.println("Created RWInstance from template DossierID: " + dossierTemplateID);

	  //get manipulator
      RWManipulation rwm = rwi.getRWManipulator();

      //Add dataset to document
      rwm.addDataSet(datasetID, EnumDSSXMLObjectTypes.DssXmlTypeReportDefinition, true);
      RWInstance newInst = rwi.getRWManipulator().applyChanges();
      rwi.setAsync(false);
      rwi.pollStatus();
  
      System.out.println("Added dataset with ID: " + datasetID);
  
      //Get the folder object by passing the object ID
      WebFolder folder = (WebFolder)factory.getObjectSource().getObject(saveFolderID, EnumDSSXMLObjectTypes.DssXmlTypeFolder);
      folder.populate();
      
      //Save the document under the required folder
      rwi.setSaveAsFlags(EnumDSSXMLDocSaveAsFlags.DssXmlDocSaveAsOverwrite);
      rwi.saveAs(folder,saveName,"Document Created using SDK");
      
      System.out.println("Saved dossier with name: " + saveName + " to folder named: " + folder.getName());
      System.out.println("Complete");
	   } catch (Exception e) {
		   e.printStackTrace();
	   }
	}
}

