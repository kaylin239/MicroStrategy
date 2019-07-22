## SSO and Custom Security

MicroStrategy allows developers to have fine-grained control over the authentication and authorization process that govern what actions a user can take and granularity of the data the user can view. 

Out of the box, MicroStrategy supports a number of authentication modes:
* `Standard (User/Pass)`
* `LDAP`
* `SAML`
* `Integrated (Kerberos)`
* `Trusted`

However, there may be situations where it is desireable to integrate with a custom SSO provider that falls outside of this list, or to perform additional custom logic and automation during the authentication process. To handle these situations, MicroStrategy provides a mechanism to customize both of our web applications `(MicroStrategy Web and MicroStrategy Library)`.

This section will provide a number of custom security examples for both web and library.

## Documentation

### Web
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/WebSDK/Content/topics/sso/SSO_Using_Custom_ESM.htm


### Library
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/LibrarySDK/Content/topics/CustomAuth_Intro.htm?tocpath=Library%20SDK%7CCustomizing%20authentication%20for%20MicroStrategy%20Library%7C_____0
