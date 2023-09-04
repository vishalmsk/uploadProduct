# uploadProduct
Node application for uploading import spreadsheet of PL. Following command are supported by this application.

# > node upload

To upload any file you can run the following command

**node upload "ProductID" "Import Spreadsheet Path"**

Below are some examples on how to upload product -   

For upload APMicro_import_spreadsheet_v0.06 -

**node upload "T5650D" "D:\projects\explore\Project Execution\temp\vishal\nodeJS\uploadProductPL\sheets\APMicro_import_spreadsheet_v0.06.xlsx"**


For AP US History Interactive

**node upload "T4310D" "D:\projects\explore\Project Execution\temp\vishal\nodeJS\uploadProductPL\sheets\APUSH_import_spreadsheet_v0.44.xlsx"**

For Connection ELA 9

**node upload "CONNECTIONS_G9" "D:\projects\explore\Project Execution\temp\vishal\nodeJS\uploadProductPL\sheets\Connections_ELA_G9_Import_Spreadsheets_v2.44.xlsx"**

# > node updateProblemEditorFiles

To update problemEditor files - run the following command.

 **node updateProblemEditorFiles 'PL GIT REPO Local folder path'**
 
 **eg. node updateProblemEditorFiles 'D:/projects/PL/apps/ProblemEditor/'**

 Please make sure that your local PL Git repo is upto date from development branch. The Git repo URL is  (https://github.com/perfectionlearning/apps/tree/development/ProblemEditor)

**How this command works?** 

This comand will update problemEditor files of node application from the latest update PL GIT REPO Local folder.

# > node help

This command will list down the available commands in node application and its example


