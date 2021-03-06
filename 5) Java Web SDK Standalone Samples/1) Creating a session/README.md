### Purpose
<img src="./readmeContent/e1.png"  width="500"/>

This is a very simple sample to show how to instantiate a `WebIServerSession` object using the Web SDK. Once a session is created, developers may use the web SDK to peform additional tasks as needed. 

### Prerequisites

1) Import MSTR JARs into desired JAVA IDE.
The Web SDK consists of a number of java packages that are included in the installation/deployment of the MicroStrategy Web application. You can also download a copy of the MSDL which contains all the libraries at the link below:
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/WebSDK/Content/topics/DownloadableWebSDKZipFile.htm

Using Eclipse (or your preferred java IDE), import the MSTR packages to begin using the Web SDK.

### Setup 

1) Download the java sample and import into your preferred IDE
2) Modify the configuration parameters to reflect your environment

```java
  static String server_name = "xxx.xxx.xxx.xxx"; //IP or FQDN for MSTR Intelligence Server
  static String server_port = "0"; //MSTR Intelligence Server Port
  static String project_name = "MicroStrategy Tutorial"; //Project to create session for
  static String admin_username = "username"; //MSTR Username
  static String admin_password = "password"; //MST Password
  ```
3) Compile and run the sample
  


# Documentation
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/WebSDK/Content/topics/other/Introduction_to_the_Web_SDK.htm
