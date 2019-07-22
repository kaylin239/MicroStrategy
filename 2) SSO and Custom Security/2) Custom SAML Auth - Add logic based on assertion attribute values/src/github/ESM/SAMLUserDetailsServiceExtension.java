package github.ESM;

import java.util.List;

import org.opensaml.saml2.core.Assertion;
import org.opensaml.saml2.core.Attribute;
import org.opensaml.saml2.core.AttributeStatement;
import org.opensaml.saml2.core.AuthnStatement;
import org.opensaml.xml.XMLObject;
import org.opensaml.xml.schema.XSAny;
import org.opensaml.xml.schema.XSString;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;

import com.microstrategy.auth.saml.SAMLUserDetailsServiceImpl;

public class SAMLUserDetailsServiceExtension extends SAMLUserDetailsServiceImpl {

	
	@Override
	public Object loadUserBySAML(SAMLCredential arg0) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		
		System.out.println("LoadUserBySAML"); 
		 Assertion assertion = arg0.getAuthenticationAssertion();
		 System.out.println("Assertion.AttributeStatements count: " + assertion.getAttributeStatements().size());
		 for (AttributeStatement attributeStatement : assertion.getAttributeStatements()) {
			 for (Attribute attribute : attributeStatement.getAttributes()){
			      String attName = attribute.getName();
			        System.out.println("attribute: " + attName + " = " + getAttValue(attribute));
		      }
	      }
		
		 
		return super.loadUserBySAML(arg0);
	}
	
	private String getAttValue(Attribute attribute)
	  {
	    List<XMLObject> values = attribute.getAttributeValues();
	    if ((values != null) && (values.size() > 0)) {
	      return getValue((XMLObject)values.get(0));
	    }
	    return null;
	  }
	  
	  protected String getValue(XMLObject ob)
	  {
	    if ((ob instanceof XSString))
	      return ((XSString)ob).getValue();
	    if ((ob instanceof XSAny)) {
	      return ((XSAny)ob).getTextContent();
	    }
	    return null;
	  }
}
