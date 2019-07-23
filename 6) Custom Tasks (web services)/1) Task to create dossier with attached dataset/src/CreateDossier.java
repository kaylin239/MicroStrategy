/**
 * MicroStrategy SDK Sample
 *
 * Copyright © 2018 MicroStrategy Incorporated. All Rights Reserved.
 *
* MICROSTRATEGY MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE 
 * SUITABILITY OF THIS SAMPLE CODE, EITHER EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS 
 * FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. MICROSTRATEGY SHALL NOT 
 * BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, 
 * MODIFYING OR DISTRIBUTING THIS SAMPLE CODE OR ITS DERIVATIVES.
 *
 *
 */

package task;

import com.microstrategy.web.beans.MarkupOutput;
import com.microstrategy.web.beans.RequestKeys;
import com.microstrategy.web.objects.WebFolder;
import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectInfo;
import com.microstrategy.web.objects.WebObjectsFactory;
import com.microstrategy.web.objects.rw.RWInstance;
import com.microstrategy.web.objects.rw.RWManipulation;
import com.microstrategy.web.tasks.AbstractBaseTask;
import com.microstrategy.web.tasks.TaskParameterMetadata;
import com.microstrategy.web.tasks.TaskRequestContext;
import com.microstrategy.webapi.EnumDSSXMLDocSaveAsFlags;
import com.microstrategy.webapi.EnumDSSXMLObjectTypes;

public class CreateDossier extends AbstractBaseTask  {

	
	private TaskParameterMetadata _sessionState ;
	private TaskParameterMetadata _datasetID;
	private TaskParameterMetadata _dossierTemplateID;
	private TaskParameterMetadata _folderID;
	private TaskParameterMetadata _nameToAssign;
	private TaskParameterMetadata _descriptionToAssign;
	
	
    public CreateDossier() {
        super("CreateDossier");
        // TODO Auto-generated method stub
        
        
	     _sessionState = addParameterMetadata("SessionState", "Provide SessionState.", true, "");
	     _datasetID = addParameterMetadata("DatasetID", "Provide the ID for the dataset to add to the created dossier", true, "");
	     _dossierTemplateID = addParameterMetadata("DossierTemplateID", "Provide ID of a blank dossier (to use as template).", true, "");
	     _folderID = addParameterMetadata("SaveLocationFolderID", "Provide a folder ID where you want the dossier to be saved.", true, "");
	     _nameToAssign = addParameterMetadata("AssignedName", "Provide name for the dossier.", true, "");
	     _descriptionToAssign = addParameterMetadata("AssignedDescription", "Provide a description for the dossier.", false, "");
    }
    
    
    
    public void processRequest(TaskRequestContext context, MarkupOutput markupOutput) {
		markupOutput.setContentType("application/json;charset=UTF-8");	
		RequestKeys keys = context.getRequestKeys();
		String sessionState = keys.getValue(_sessionState.getName());
		String datasetID = keys.getValue(_datasetID.getName());
		String dossierTemplateID = keys.getValue(_dossierTemplateID.getName());
		String folderID = keys.getValue(_folderID.getName());
		String nameToAssign = keys.getValue(_nameToAssign.getName());
		String descriptionToAssign = keys.getValue(_descriptionToAssign.getName());
		
		System.out.println(datasetID + " " +  dossierTemplateID+ " " +  folderID+ " " +  nameToAssign+ " " +  descriptionToAssign);
   	    
   	   
		 //Create session 
	      WebObjectsFactory factory=WebObjectsFactory.getInstance();
	      
	      WebIServerSession serverSession = null;
	      serverSession=factory.getIServerSession();
	      serverSession.restoreState(sessionState);
	     
		try {
			serverSession.getSessionID();
			serverSession.refresh();
			serverSession.reconnect();
		  
		   //Create a blank dossier and use this as a template to save new dossiers with different datasets.
		   WebObjectInfo objInfo = factory.getObjectSource().getObject(dossierTemplateID, EnumDSSXMLObjectTypes.DssXmlTypeDocumentDefinition );
		      objInfo.populate();
		      String docId = objInfo.getID();
		      RWInstance rwi = factory.getRWSource().getNewInstance(docId);
		      rwi.pollStatus();

		      
		      RWManipulation rwm = rwi.getRWManipulator();

				//Add dataset to document
				rwm.addDataSet(datasetID, EnumDSSXMLObjectTypes.DssXmlTypeReportDefinition, true);
				RWInstance newInst = rwi.getRWManipulator().applyChanges();
				rwi.setAsync(false);
				rwi.pollStatus();
		      
		      
		      //Get the folder object by passing the object ID
		      WebFolder folder = (WebFolder)factory.getObjectSource().getObject(folderID, EnumDSSXMLObjectTypes.DssXmlTypeFolder);
		   folder.populate();

		   //Save the document under the required folder
		 //Save changes done to document
		  rwi.setSaveAsFlags(EnumDSSXMLDocSaveAsFlags.DssXmlDocSaveAsOverwrite);
		  WebObjectInfo newObj =  rwi.saveAs(folder,nameToAssign,descriptionToAssign);
		 
		  
		  
		  
		  
	
		  
		  markupOutput.append("{\"ID\": \""+newObj.getID()+"\",\"Name\": \""+newObj.getDisplayName()+"\",\"Desc\": \"" +newObj.getDescription()+"\"}");

		} catch (Exception e) {
		   e.printStackTrace();
		   
		   markupOutput.append(e.getMessage());
		 }
	 }

}